
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getMentorFeedback } from '@/ai/flows/ai-mentor-feedback';
import ReactMarkdown from 'react-markdown';

const feedbackSchema = z.object({
  weeklyActivity: z.string().min(20, 'Please describe your activities in at least 20 characters.'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function AiMentorView() {
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useUser();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      weeklyActivity: '',
    },
  });

  const handleGetFeedback = async (values: FeedbackFormValues) => {
    if (!profile) {
      toast({
        variant: 'destructive',
        title: 'Profile not available',
        description: 'Your profile is still loading. Please wait and try again.',
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const studentSkills = (profile.skills || []).map(skill => skill.name);
      const result = await getMentorFeedback({
        weeklyActivity: values.weeklyActivity,
        skills: studentSkills,
        profileSummary: profile.profileSummary || 'No profile summary available.',
      });
      setFeedback(result.feedback);
    } catch (error: any) {
      console.error('AI Feedback Error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to get feedback',
        description: 'An error occurred while communicating with the AI mentor.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGetFeedback)}>
            <CardHeader>
              <CardTitle>Get Personalized Feedback from your AI Mentor</CardTitle>
              <CardDescription>
                Tell the AI mentor what you've worked on this week. It will analyze your activities in the context of your skill profile and provide actionable tips for improvement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="weeklyActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Weekly Activities & Learnings</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'This week I finished a React tutorial on state management, deployed a small project to Vercel, and solved 5 medium problems on LeetCode...'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate My Feedback
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="p-6 flex items-center justify-center">
                 <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                 <p className="text-muted-foreground">Your AI mentor is crafting your feedback...</p>
            </CardContent>
        </Card>
      )}

      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Your Feedback & Improvement Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </article>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
