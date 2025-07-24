
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/icons';
import { analyzeAndBuildProfile } from '@/ai/actions/onboarding';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').refine(email => email.endsWith('@satiengg.in'), {
    message: 'Must be a valid SATI email address (@satiengg.in)',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  branch: z.string().min(2, 'Branch is required'),
  year: z.coerce.number().min(1).max(4, 'Year must be between 1 and 4'),
  githubUrl: z.string().url('Invalid GitHub URL'),
  linkedinUrl: z.string().url('Invalid LinkedIn URL'),
  leetcodeUrl: z.string().url('Invalid LeetCode URL').optional().or(z.literal('')),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        branch: '',
        year: 1,
        githubUrl: '',
        linkedinUrl: '',
        leetcodeUrl: '',
    }
  });

  const handleSignUp = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Send verification email
      await sendEmailVerification(user);

      // 3. Update Firebase Auth profile
      await updateProfile(user, {
        displayName: values.name,
      });

      // 4. Create user document in Firestore with basic info
      const userDocRef = doc(db, 'users', user.uid);
      const { confirmPassword, ...userData } = values;
      await setDoc(userDocRef, {
        uid: user.uid,
        ...userData,
        createdAt: new Date(),
      });

      // 5. Trigger the AI analysis flow in the background (no need to await)
      analyzeAndBuildProfile({
          githubUrl: values.githubUrl,
          linkedinUrl: values.linkedinUrl,
          leetcodeUrl: values.leetcodeUrl,
      }).then(aiProfileData => {
          // 6. Update the user document with the AI-generated data
          setDoc(userDocRef, { ...aiProfileData }, { merge: true });
      }).catch(err => {
          console.error("AI analysis failed on signup:", err);
          // Optional: You could store a flag that analysis failed and retry later.
      });

      toast({
          title: 'Account Created!',
          description: "We've sent a verification link to your email.",
      });
      
      router.push('/verify-email');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
             <Link href="/" aria-label="Back to home">
               <Logo className="h-10 w-10 text-primary" />
            </Link>
          </div>
          <CardTitle className="text-2xl">Create Your SATIInsight Profile</CardTitle>
          <CardDescription>Provide your details and let our AI do the rest.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@satiengg.in" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              
               <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="branch" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="CSE">CSE</SelectItem>
                                <SelectItem value="CSE(Block Chain)">CSE (Block Chain)</SelectItem>
                                <SelectItem value="AIADS">AI & Data Science</SelectItem>
                                <SelectItem value="AIML">AI & Machine Learning</SelectItem>
                                <SelectItem value="IOT">Internet of Things (IoT)</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="EC">Electronics & Communication</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="year" render={({ field }) => (
                  <FormItem><FormLabel>Academic Year</FormLabel><Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
                    </SelectContent>
                  </Select><FormMessage /></FormItem>
                )} />
              </div>

              <div className="space-y-2">
                 <p className="text-sm font-medium">Professional Profiles</p>
                 <FormField control={form.control} name="githubUrl" render={({ field }) => (
                    <FormItem><FormLabel className="sr-only">GitHub URL</FormLabel><FormControl><Input placeholder="GitHub Profile URL (Required)" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                    <FormItem><FormLabel className="sr-only">LinkedIn URL</FormLabel><FormControl><Input placeholder="LinkedIn Profile URL (Required)" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="leetcodeUrl" render={({ field }) => (
                    <FormItem><FormLabel className="sr-only">LeetCode URL</FormLabel><FormControl><Input placeholder="LeetCode Profile URL (Optional)" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account & Analyze Profile
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
