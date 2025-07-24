'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { Bot, Search, Star, Presentation, Users } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: 'AI Skill Validator',
    description: 'Assesses student skills based on public data and projects, providing a 1-5 star rating.',
  },
  {
    icon: <Presentation className="h-8 w-8 text-primary" />,
    title: 'Creative Talent Showcase',
    description: 'Allows students to present non-tech talents via videos, portfolios, and social media.',
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Advanced Skill Search',
    description: 'Enables recruiters to filter talent by academic year and specific verified skills.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'Personalized AI Mentor',
    description: 'Offers personalized feedback and improvement tips based on weekly student activities.',
  },
];

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SATIInsight</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter">
              Unlock Your Potential.
              <br />
              <span className="text-primary">Be Discovered.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              SATIInsight is an AI-powered platform that validates your skills, showcases your unique talents, and connects you with opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Sign Up for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/10 rounded-full blur-3xl"></div>
              <Logo className="relative h-64 w-64 md:h-80 md:w-80 text-primary" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-20 md:py-28">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">A Platform Built for Growth</h2>
              <p className="text-lg text-muted-foreground">
                From AI-driven skill validation to personalized mentorship, we provide the tools you need to succeed.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center p-6 bg-background hover:shadow-xl transition-shadow">
                  <CardHeader className="flex justify-center items-center mb-4">
                    {feature.icon}
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 md:py-28">
          <div className="container text-center">
             <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
             <p className="mt-4 mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                Join the SATIInsight community today and start building a verified portfolio that truly represents your abilities.
             </p>
             <Button size="lg" asChild>
                <Link href="/signup">Create Your Profile Now</Link>
              </Button>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row">
          <div className="flex items-center gap-2">
             <Logo className="h-6 w-6" />
             <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} SATIInsight. All rights reserved.
             </p>
          </div>
           <p className="text-sm text-muted-foreground">
             Created with ❤️ by <a href="mailto:shreya28it063@satiengg.in" className="font-semibold text-primary hover:underline">Shreya Mangal</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
