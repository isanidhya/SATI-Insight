'use client';

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { validateSkills } from '@/ai/flows/validate-skills';
import { suggestSkills } from '@/ai/flows/suggest-skills';
import type { Skill, Project } from '@/lib/types';
import { StarRating } from '../star-rating';
import { Separator } from '../ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

const skillValidationSchema = z.object({
  skill: z.string().min(2, { message: "Skill name must be at least 2 characters." }),
  proof: z.string().url({ message: "Please enter a valid URL for proof." }),
})

export function MyProfileView() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // This is a placeholder since we don't have a database for this yet.
  const [skills, setSkills] = useState<Skill[]>([
        { name: 'React', rating: 4, verified: true, proof: 'https://github.com/johndoe/project-x' },
        { name: 'Node.js', rating: 5, verified: true, proof: 'https://github.com/johndoe/project-y' },
        { name: 'TypeScript', rating: 3, verified: true, proof: 'https://github.com/johndoe/project-z' },
        { name: 'SQL', rating: 2, verified: false },
    ]);
  const [projects, setProjects] = useState<Project[]>([
        { name: 'Project X', description: 'A full-stack web application using React and Node.js.', link: 'https://github.com/johndoe/project-x' },
        { name: 'Project Y', description: 'A mobile app built with React Native and TypeScript.', link: 'https://github.com/johndoe/project-y' },
    ]);
  const [academicYear, setAcademicYear] = useState(3);


  const [isValidating, setIsValidating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const form = useForm<z.infer<typeof skillValidationSchema>>({
    resolver: zodResolver(skillValidationSchema),
    defaultValues: {
      skill: "",
      proof: "",
    },
  });

  async function onValidateSkill(values: z.infer<typeof skillValidationSchema>) {
    setIsValidating(true);
    try {
      const result = await validateSkills(values);
      const newSkill: Skill = {
        name: values.skill,
        rating: result.skillRating,
        proof: values.proof,
        verified: true,
      };
      setSkills(prev => [...prev, newSkill]);

      toast({
        title: `Skill "${values.skill}" validated!`,
        description: `You've been rated ${result.skillRating} stars. Feedback: ${result.feedback}`,
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Could not validate skill. Please try again.",
      });
    } finally {
      setIsValidating(false);
    }
  }

  async function onSuggestSkills() {
    setIsSuggesting(true);
    setSuggestedSkills([]);
    try {
      const result = await suggestSkills({
        projectDescriptions: projects.map(p => p.description),
        publicData: `The user is a year ${academicYear} student.`,
      });
      setSuggestedSkills(result.suggestedSkills);
      toast({
        title: "Skills Suggested!",
        description: "We've found some skills based on your projects.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Suggestion Failed",
        description: "Could not suggest skills. Please try again.",
      });
    } finally {
      setIsSuggesting(false);
    }
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Skills</CardTitle>
          <CardDescription>Manage your verified and unverified skills.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-muted/50">
                <div>
                  <p className="font-medium">{skill.name}</p>
                  <Badge variant={skill.verified ? "default" : "secondary"}>
                    {skill.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                {skill.verified && <StarRating rating={skill.rating} />}
              </div>
            ))}
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 /> AI Skill Validator
            </CardTitle>
            <CardDescription>Add a new skill and get it validated by AI based on your proof of work.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onValidateSkill)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="skill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Next.js" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proof URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/your-repo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isValidating}>
                  {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Validate Skill
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles /> AI Skill Suggester
            </CardTitle>
            <CardDescription>Let AI suggest skills based on your existing projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onSuggestSkills} disabled={isSuggesting}>
              {isSuggesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Skills From My Projects
            </Button>
            {suggestedSkills.length > 0 && (
              <div className="mt-4 space-y-2">
                <Separator />
                <p className="font-semibold pt-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
