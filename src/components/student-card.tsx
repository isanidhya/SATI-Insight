import Image from 'next/image';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/star-rating';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface StudentCardProps {
  student: User;
  onViewProfile: (student: User) => void;
}

export function StudentCard({ student, onViewProfile }: StudentCardProps) {
  const topSkills = student.skills.filter(s => s.verified).slice(0, 3);
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onViewProfile(student)}
      onKeyDown={(e) => e.key === 'Enter' && onViewProfile(student)}
      tabIndex={0}
      aria-label={`View profile for ${student.name}`}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar className="h-16 w-16">
            <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="student portrait" />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{student.name}</CardTitle>
          <p className="text-sm text-muted-foreground">Year {student.academicYear}</p>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold text-sm mb-2">Top Verified Skills</h4>
        <div className="space-y-2">
          {topSkills.length > 0 ? topSkills.map((skill) => (
            <div key={skill.name} className="flex justify-between items-center">
              <span className="text-sm">{skill.name}</span>
              <StarRating rating={skill.rating} />
            </div>
          )) : (
             <p className="text-sm text-muted-foreground">No verified skills yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
