
'use client';

import { useState, useRef, useEffect } from 'react';
import { conversationalMentor } from '@/ai/actions/conversational-mentor';
import type { Message } from '@/lib/ai-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

export function MentorView() {
  const { toast } = useToast();
  const { user, profile, loading: profileLoading } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !profile || !user) {
      if (!profile || !user) {
        toast({
          variant: 'destructive',
          title: 'Profile not loaded',
          description: 'Please wait for your profile to load before chatting.',
        });
      }
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await conversationalMentor({
        profile: { ...profile, uid: user.uid },
        history: [...messages, userMessage],
      });
      setMessages(prev => [...prev, result]);
    } catch (error: any) {
      console.error('AI Mentor Error:', error);
      const errorMessage: Message = {
        role: 'model',
        content: "Sorry, I ran into an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: 'Failed to get response',
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
    <Card className="max-w-4xl mx-auto h-[80vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot /> Your Personalized AI Mentor
        </CardTitle>
        <CardDescription>
          Chat with your AI mentor. It has context about your skills and profile to give you personalized advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
                 <div className="text-center text-muted-foreground p-8">
                    <p>Start the conversation! Ask for project ideas, career advice, or how to improve a specific skill.</p>
                 </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={cn(
                  "flex items-start gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
              )}>
                 {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                 )}
                 <div className={cn(
                    "p-3 rounded-lg max-w-lg",
                    message.role === 'user' 
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                 )}>
                    <article className="prose dark:prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </article>
                 </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{user?.displayName?.charAt(0) || <User/>}</AvatarFallback>
                    </Avatar>
                 )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin"/>
                        <span>Thinking...</span>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
          <Input
            id="chat-input"
            placeholder="Ask your mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || profileLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading || profileLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
