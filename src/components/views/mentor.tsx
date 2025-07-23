'use client';

import { useState } from 'react';
import { getMentorFeedback } from '@/ai/flows/ai-mentor-feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import { Bot, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Skill } from '@/lib/types';


export function MentorView() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [weeklyActivity, setWeeklyActivity] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // This is a placeholder since we don't have a database for skills yet.
  const userSkills =  [
        { name: 'React', rating: 4, verified: true, proof: 'https://github.com/johndoe/project-x' },
        { name: 'Node.js', rating: 5, verified: true, proof: 'https://github.com/johndoe/project-y' },
        { name: 'TypeScript', rating: 3, verified: true, proof: 'https://github.com/johndoe/project-z' },
        { name: 'SQL', rating: 2, verified: false },
    ];


  const handleGetFeedback = async () => {
    if (!weeklyActivity.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please describe your weekly activity first.",
      });
      return;
    }

    setIsLoading(true);
    setFeedback('');

    try {
      const result = await getMentorFeedback({
        weeklyActivity,
        skills: userSkills.map(s => s.name),
      });
      setFeedback(result.feedback);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to get feedback",
        description: "An error occurred while communicating with the AI mentor. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot /> Your Personalized AI Mentor
        </CardTitle>
        <CardDescription>
          Describe your weekly learning and project activities to get personalized feedback and improvement tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="weeklyActivity" className="font-medium text-sm">Your weekly activity</label>
          <Textarea
            id="weeklyActivity"
            placeholder="e.g., Finished the authentication feature for my project, learned about advanced React hooks, read two chapters of 'Designing Data-Intensive Applications'..."
            value={weeklyActivity}
            onChange={(e) => setWeeklyActivity(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
        <Button onClick={handleGetFeedback} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Feedback
        </Button>
        
        {feedback && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Mentor's Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{feedback}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
