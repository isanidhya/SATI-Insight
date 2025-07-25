
import type { User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from './star-rating';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Briefcase, FileText, Github, Linkedin, Code, Star, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';

interface StudentProfileDialogProps {
  student: User | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function StudentProfileDialog({ student, isOpen, onOpenChange }: StudentProfileDialogProps) {
  const { user: currentUser } = useAuth();

  if (!student) return null;

  // Safe access to all potentially missing properties with fallbacks
  const skills = student.skills || [];
  const profileSummary = student.profileSummary || 'No AI summary available for this profile yet.';
  const overallRating = student.overallRating || 0;
  const studentName = student.name || 'Unnamed Student';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start gap-6 space-y-0 mb-4">
          <Avatar className="h-24 w-24 border">
            <AvatarFallback className="text-3xl">{studentName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5 flex-grow">
            <DialogTitle className="text-3xl font-bold">{studentName}</DialogTitle>
            <DialogDescription className="text-md text-muted-foreground">
              {student.branch || 'N/A'} | Year {student.year || 'N/A'}
            </DialogDescription>
            <div className="flex items-center gap-4 pt-2">
                {student.githubUrl && <a href={student.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="GitHub Profile"><Github /></a>}
                {student.linkedinUrl && <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="LinkedIn Profile"><Linkedin /></a>}
                {student.leetcodeUrl && <a href={student.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" aria-label="LeetCode Profile"><Code /></a>}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Star className="h-5 w-5 text-yellow-400"/> Overall Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-5xl font-bold">{overallRating.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">out of 5.0</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5"/> AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{profileSummary}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5" /> Verified Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {skills.length > 0 ? skills.map(skill => (
                            <div key={skill.name} className="p-2 rounded-md transition-colors hover:bg-muted/50">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold">{skill.name}</p>
                                    <StarRating rating={skill.rating} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold">Evidence:</span> {skill.evidence}
                                </p>
                            </div>
                        )) : (
                            <p className="text-center text-muted-foreground py-8">No skills have been analyzed yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
