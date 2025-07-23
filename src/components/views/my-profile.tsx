'use client';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { suggestSkills } from '@/ai/flows/suggest-skills';
import type { Skill } from '@/lib/types';
import { StarRating } from '../star-rating';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

const githubProfileSchema = z.object({
  githubUrl: z.string().url({ message: "Please enter a valid GitHub profile URL." }),
});

export function MyProfileView() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [suggestedSkills, setSuggestedSkills] = useState<Skill[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<z.infer<typeof githubProfileSchema>>({
    resolver: zodResolver(githubProfileSchema),
    defaultValues: {
      githubUrl: "",
    },
  });

  async function onAnalyzeProfile(values: z.infer<typeof githubProfileSchema>) {
    setIsSuggesting(true);
    setSuggestedSkills([]);
    try {
      // NOTE: This is a placeholder for the actual implementation.
      // We will need to implement a flow that takes a GitHub URL,
      // fetches the repositories, and then suggests and validates skills.
      // For now, we will simulate the result.
      const result = await suggestSkills({
        projectDescriptions: [
            "A full-stack web application using React and Node.js.",
            "A mobile app built with React Native and TypeScript.",
            "A Python script for data analysis with Pandas and NumPy."
        ],
        publicData: `The user's GitHub profile is ${values.githubUrl}`,
      });

      // Simulate skill validation based on suggestions
      const validatedSkills = result.suggestedSkills.map(skill => ({
        name: skill,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating for now
        verified: true,
        proof: values.githubUrl
      }));
      
      setSuggestedSkills(validatedSkills);

      toast({
        title: "Profile Analysis Complete!",
        description: "We've suggested some skills based on your GitHub profile.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze GitHub profile. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles /> AI-Powered Skill Analysis
          </CardTitle>
          <CardDescription>
            Enter your GitHub profile URL to automatically discover and rate your skills. 
            The AI will analyze your public repositories to build your skill profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAnalyzeProfile)} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>GitHub Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/your-username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSuggesting} className="h-10">
                {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze My Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {suggestedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Skills</CardTitle>
            <CardDescription>Review the skills suggested by the AI. You can choose which ones to add to your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {suggestedSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <Badge variant={skill.verified ? "default" : "secondary"}>
                      {skill.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarRating rating={skill.rating} />
                    <Button variant="outline" size="sm">Add to Profile</Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
