'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, BookOpen } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { getImprovementRoadmap } from '@/ai/actions/improvement-roadmap';
import type { ImprovementRoadmapOutput } from '@/lib/ai-types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function ImprovementsView() {
  const { toast } = useToast();
  const { profile, loading: profileLoading } = useUser();
  const [roadmap, setRoadmap] = useState<ImprovementRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRoadmap = async () => {
    if (!profile || !profile.skills || !profile.profileSummary) {
      toast({
        variant: 'destructive',
        title: 'Profile Incomplete',
        description: 'Your profile must be fully analyzed to generate a roadmap. Please visit "My Profile" first.',
      });
      return;
    }

    setIsLoading(true);
    setRoadmap(null);

    try {
      const result = await getImprovementRoadmap({
        name: profile.name,
        year: profile.year,
        branch: profile.branch,
        skills: profile.skills,
        profileSummary: profile.profileSummary,
      });
      setRoadmap(result);
    } catch (error: any) {
      console.error('AI Roadmap Error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to generate roadmap',
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
        <CardHeader>
          <CardTitle>Your Personalized Improvement Roadmap</CardTitle>
          <CardDescription>
            Let our AI analyze your complete profile to generate a step-by-step roadmap for skill enhancement and career growth.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button onClick={handleGenerateRoadmap} disabled={isLoading || profileLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {roadmap ? 'Re-generate My Roadmap' : 'Generate My Roadmap'}
            </Button>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="p-6 flex items-center justify-center">
                 <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                 <p className="text-muted-foreground">Your AI mentor is building your personal roadmap...</p>
            </CardContent>
        </Card>
      )}

      {roadmap && roadmap.roadmap.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your 3-6 Month Roadmap</CardTitle>
             <CardDescription>
                Follow these steps to level-up your skills and profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {roadmap.roadmap.map((step, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">
                    Step {index + 1}: {step.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-muted-foreground">{step.description}</p>
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2"><BookOpen className="h-5 w-5" /> Suggested Resources</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{step.resources}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
