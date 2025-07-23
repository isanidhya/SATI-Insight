
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail } from 'lucide-react';

export function SupportView() {
  return (
    <div className="flex justify-center items-start pt-8">
        <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Avatar className="h-24 w-24 border">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Shreya Mangal" data-ai-hint="woman portrait" />
                    <AvatarFallback>SM</AvatarFallback>
                </Avatar>
            </div>
            <CardTitle className="text-2xl">Shreya Mangal</CardTitle>
            <CardDescription className="text-md">
                2nd Year IT Student at SATI, Vidisha
            </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-lg font-semibold mb-4">Created By</p>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <a href="mailto:shreya28it063@satiengg.in" className="hover:text-primary">
                    shreya28it063@satiengg.in
                </a>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
