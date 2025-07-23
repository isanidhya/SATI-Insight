import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface StudentCardProps {
  student: User;
  onViewProfile: (student: User) => void;
}

export function StudentCard({ student, onViewProfile }: StudentCardProps) {
  // Safe access to skills, providing an empty array as a fallback.
  // Sort by rating and take the top 3.
  const topSkills = (student.skills || [])
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onViewProfile(student)}
      onKeyDown={(e) => e.key === 'Enter' && onViewProfile(student)}
      tabIndex={0}
      aria-label={`View profile for ${student.name}`}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar className="h-16 w-16 border">
          {/* Avatar image is not part of the current user model */}
          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{student.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{student.branch} | Year {student.year}</p>
        </div>
        {student.overallRating && (
            <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full h-12 w-12 text-lg font-bold">
                {student.overallRating.toFixed(1)}
            </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-semibold text-sm mb-2">Top Skills</h4>
        <div className="space-y-2">
          {topSkills.length > 0 ? topSkills.map((skill) => (
            <div key={skill.name} className="flex justify-between items-center">
              <span className="text-sm">{skill.name}</span>
              <StarRating rating={skill.rating} />
            </div>
          )) : (
             <p className="text-sm text-muted-foreground text-center py-4">No skills analyzed yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
