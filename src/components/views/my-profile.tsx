
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { suggestSkills } from '@/ai/flows/suggest-skills';
import { analyzeSocialProfiles } from '@/ai/flows/social-profile-analyzer';
import { validateSkills } from '@/ai/flows/validate-skills';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/firebase';
import { Github, Linkedin, Code, Loader2, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '../star-rating';

const profileSchema = z.object({
  githubUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  leetcodeUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export function MyProfile() {
  const { user, profile, loading, refreshProfile } = useUser();
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      githubUrl: '',
      linkedinUrl: '',
      leetcodeUrl: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        leetcodeUrl: profile.leetcodeUrl || '',
      });
    }
  }, [profile, form]);

  const getUsernameFromUrl = (url: string) => {
    if (!url) return null;
    try {
      const path = new URL(url).pathname;
      const username = path.split('/')[1];
      return username || null;
    } catch {
      return null;
    }
  };

  async function onAnalyzeProfiles() {
    setIsSuggesting(true);
    setSuggestedSkills([]);
    try {
      const values = form.getValues();
      const githubUsername = getUsernameFromUrl(values.githubUrl || '');
      
      const analyses: Promise<string[]>[] = [];

      if (githubUsername) {
        analyses.push(suggestSkills({ githubUsername }).then(r => r.skills));
      }
      
      if (values.linkedinUrl || values.leetcodeUrl) {
         analyses.push(analyzeSocialProfiles({ 
          linkedinUrl: values.linkedinUrl, 
          leetcodeUrl: values.leetcodeUrl 
        }).then(r => r.skills));
      }

      if(analyses.length === 0) {
        toast({ variant: "destructive", title: 'No profiles to analyze', description: 'Please provide at least one profile URL.' });
        setIsSuggesting(false);
        return;
      }

      const results = await Promise.all(analyses);
      const combinedSkills = [...new Set(results.flat())];
      
      setSuggestedSkills(combinedSkills);
      toast({ title: 'Analysis complete!', description: `Found ${combinedSkills.length} potential skills.` });

    } catch (error: any) {
      toast({ variant: "destructive", title: 'Analysis Failed', description: error.message });
    } finally {
      setIsSuggesting(false);
    }
  }

  async function onValidateAndSaveSkills() {
    if (suggestedSkills.length === 0 || !user) return;

    setIsSaving(true);
    try {
      const values = form.getValues();
      const proof = `GitHub: ${values.githubUrl || 'N/A'}, LinkedIn: ${values.linkedinUrl || 'N/A'}, LeetCode: ${values.leetcodeUrl || 'N/A'}`;
      
      const { validatedSkills } = await validateSkills({ skills: suggestedSkills, proof });
      
      await updateUserProfile(user.uid, {
        skills: validatedSkills,
        githubUrl: values.githubUrl,
        linkedinUrl: values.linkedinUrl,
        leetcodeUrl: values.leetcodeUrl,
      });
      
      toast({ title: 'Profile Updated!', description: 'Your new skills have been added to your profile.' });
      setSuggestedSkills([]);
      refreshProfile();
    } catch (error: any) {
      toast({ variant: "destructive", title: 'Validation Failed', description: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your skills and professional links.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Verified Skills</CardTitle>
          <CardDescription>This is your current skill portfolio. Re-analyze your profiles to update it.</CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.skills && profile.skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="p-3 rounded-lg border bg-muted/20">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{skill.name}</p>
                    <StarRating rating={skill.rating} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    <span className="font-medium">Evidence:</span> {skill.evidence}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No skills analyzed yet.</p>
              <p className="text-sm text-muted-foreground">Add your profile links below and click "Analyze Profiles" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); onAnalyzeProfiles(); }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Professional Profiles</CardTitle>
              <CardDescription>
                Provide links to your professional profiles. Our AI will analyze them to identify your skills.
                You'll have a chance to review them before adding them to your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Github />GitHub Profile URL</FormLabel>
                      <FormControl><Input placeholder="https://github.com/username" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Linkedin />LinkedIn Profile URL</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/username" {...field} /></FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leetcodeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Code />LeetCode Profile URL</FormLabel>
                    <FormControl><Input placeholder="https://leetcode.com/username" {...field} /></FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSuggesting || isSaving}>
                {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSuggesting ? 'Analyzing...' : 'Analyze Profiles'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {suggestedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Suggested Skills</CardTitle>
            <CardDescription>
              We found the following skills. Review them and then click the button below to validate them and add them to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill, index) => <Badge key={index} variant="secondary">{skill}</Badge>)}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button onClick={onValidateAndSaveSkills} disabled={isSaving || isSuggesting}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Validate & Add to Profile'}
            </Button>
            <Button variant="ghost" onClick={() => setSuggestedSkills([])} disabled={isSaving}>Clear Suggestions</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
