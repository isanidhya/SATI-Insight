import type { User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './star-rating';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Briefcase, Link as LinkIcon, Palette } from 'lucide-react';

interface StudentProfileDialogProps {
  student: User | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function StudentProfileDialog({ student, isOpen, onOpenChange }: StudentProfileDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="student portrait" />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <DialogTitle className="text-3xl font-bold">{student.name}</DialogTitle>
            <DialogDescription>
              Year {student.academicYear} Student | {student.email}
            </DialogDescription>
          </div>
        </DialogHeader>
        <Tabs defaultValue="skills" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills">Skills & Projects</TabsTrigger>
            <TabsTrigger value="creative">Creative Zone</TabsTrigger>
          </TabsList>
          <TabsContent value="skills" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.skills.filter(s => s.verified).map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{skill.name}</p>
                        <StarRating rating={skill.rating} />
                      </div>
                      <a href={skill.proof} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> View Proof
                      </a>
                    </div>
                  ))}
                  {student.skills.filter(s => !s.verified).length > 0 && <p className="text-sm text-muted-foreground pt-4">Unverified skills include: {student.skills.filter(s => !s.verified).map(s => s.name).join(', ')}</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.projects.map(project => (
                    <div key={project.name}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{project.name}</a>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="creative" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Non-Tech Talents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.creativeZone.map(work => (
                  <div key={work.title}>
                    <a href={work.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{work.title}</a>
                     <Badge variant="outline" className="ml-2 capitalize">{work.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
