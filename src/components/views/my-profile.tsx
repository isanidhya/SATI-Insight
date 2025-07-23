
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
import { Github, Linkedin, Code, Loader2, User, Mail, School, Calendar, Save } from 'lucide-react';
import { StarRating } from '../star-rating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  branch: z.string().min(2, 'Branch is required'),
  year: z.coerce.number().min(1).max(5),
  githubUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  leetcodeUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export function MyProfile() {
  const { user, profile, loading, refreshProfile } = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      branch: '',
      year: 1,
      githubUrl: '',
      linkedinUrl: '',
      leetcodeUrl: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        branch: profile.branch || '',
        year: profile.year || 1,
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        leetcodeUrl: profile.leetcodeUrl || '',
      });
    }
  }, [profile, form]);

  async function handleProfileUpdate(values: z.infer<typeof profileSchema>) {
     if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
        return;
    }
    setIsSaving(true);
    try {
        await updateUserProfile(user.uid, {
            name: values.name,
            email: values.email,
            branch: values.branch,
            year: values.year
        });
        toast({ title: 'Profile Saved!', description: 'Your personal details have been updated.' });
        refreshProfile();
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
    } finally {
        setIsSaving(false);
    }
  }

  async function handleAnalysis(values: z.infer<typeof profileSchema>) {
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

      // Also save the URLs themselves
      await updateUserProfile(user.uid, {
        githubUrl: values.githubUrl,
        linkedinUrl: values.linkedinUrl,
        leetcodeUrl: values.leetcodeUrl,
        ...aiProfileData,
      });

      toast({ title: 'Profile Analyzed!', description: 'Your skill portfolio has been successfully updated.' });
      refreshProfile();

    } catch (error: any) {
      toast({ variant: "destructive", title: 'Analysis Failed', description: error.message });
    } finally {
      setIsAnalyzing(false);
    }
  }

  const hasBeenAnalyzed = !!(profile?.skills && profile.skills.length > 0);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your skills and professional links.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal and academic details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><User/> Name</FormLabel>
                                <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Mail/> College Email</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                     </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="branch" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><School/> Branch</FormLabel>
                                <FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="year" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Calendar/> Academic Year</FormLabel>
                                <Select onValueChange={(value) => field.onChange(parseInt(value, 10))} value={String(field.value)}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                    {[1, 2, 3, 4, 5].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                     </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </form>

        <Card>
            <CardHeader>
                <CardTitle>My Verified Skills</CardTitle>
                <CardDescription>This is your current AI-generated skill portfolio. Re-analyze your profiles to update it.</CardDescription>
            </CardHeader>
            <CardContent>
            {hasBeenAnalyzed ? (
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
                <p className="text-sm text-muted-foreground">Add your profile links below and click "Analyze Profile" to get started.</p>
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

        <form onSubmit={form.handleSubmit(handleAnalysis)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Profiles</CardTitle>
              <CardDescription>
                Provide links to your professional profiles. Our AI will analyze them to build and update your skill portfolio.
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
                {isAnalyzing ? 'Analyzing...' : (hasBeenAnalyzed ? 'Re-analyze Profile' : 'Analyze Profile')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
