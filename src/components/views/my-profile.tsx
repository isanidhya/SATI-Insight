
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
import { useState, useEffect } from 'react';
import { analyzeAndBuildProfile } from '@/ai/actions/onboarding';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/firebase';
import { Github, Linkedin, Code, Loader2 } from 'lucide-react';
import { StarRating } from '../star-rating';

const profileSchema = z.object({
  githubUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  leetcodeUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export function MyProfile() {
  const { user, profile, loading, refreshProfile } = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update your profile.' });
        return;
    }
    
    setIsAnalyzing(true);
    try {
      if (!values.githubUrl && !values.linkedinUrl && !values.leetcodeUrl) {
          toast({ variant: 'destructive', title: 'No profiles to analyze', description: 'Please provide at least one profile URL.' });
          return;
      }

      const aiProfileData = await analyzeAndBuildProfile({
        githubUrl: values.githubUrl,
        linkedinUrl: values.linkedinUrl,
        leetcodeUrl: values.leetcodeUrl,
      });

      await updateUserProfile(user.uid, {
        ...values,
        ...aiProfileData,
      });

      toast({ title: 'Profile Updated!', description: 'Your profile has been successfully analyzed and updated.' });
      refreshProfile();

    } catch (error: any) {
      toast({ variant: "destructive", title: 'Analysis Failed', description: error.message });
    } finally {
      setIsAnalyzing(false);
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
          <CardDescription>This is your current AI-generated skill portfolio. Re-analyze your profiles to update it.</CardDescription>
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
              <p className="text-sm text-muted-foreground">Add your profile links below and click "Analyze & Update Profile" to get started.</p>
            </div>
          )}
        </CardContent>
         {profile?.profileSummary && (
             <CardFooter className="flex-col items-start gap-2 border-t pt-6">
                <h4 className="font-semibold">AI Profile Summary</h4>
                <p className="text-sm text-muted-foreground">{profile.profileSummary}</p>
             </CardFooter>
         )}
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Professional Profiles</CardTitle>
              <CardDescription>
                Provide links to your professional profiles. Our AI will analyze them to identify and rate your skills.
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
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze & Update Profile'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
