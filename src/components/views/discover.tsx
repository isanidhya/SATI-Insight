
'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentCard } from '@/components/student-card';
import { StudentProfileDialog } from '@/components/student-profile-dialog';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DiscoverViewProps {
  onNavigateToMessages: (chatId: string) => void;
}

export function DiscoverView({ onNavigateToMessages }: DiscoverViewProps) {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [academicYear, setAcademicYear] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('overallRating', 'desc'));
        const userSnapshot = await getDocs(q);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
        setStudents(userList);
      } catch (error) {
        console.error("Error fetching students: ", error);
        // Fallback to fetching without ordering if index is not ready
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
        setStudents(userList);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);
  
  const allSkills = useMemo(() => {
      const skillSet = new Set<string>();
      students.forEach(student => {
          (student.skills || []).forEach(skill => skillSet.add(skill.name));
      });
      return ['all', ...Array.from(skillSet).sort()];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const studentSkills = student.skills || [];
      const matchesYear = academicYear === 'all' || String(student.year) === academicYear;
      const matchesQuery =
        searchQuery === '' ||
        (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSkill = skillFilter === 'all' || studentSkills.some(s => s.name === skillFilter);
      return matchesYear && matchesQuery && matchesSkill;
    });
  }, [students, searchQuery, academicYear, skillFilter]);

  const handleViewProfile = (student: User) => {
    setSelectedStudent(student);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={academicYear} onValueChange={setAcademicYear}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {[1, 2, 3, 4, 5].map(y => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
          </SelectContent>
        </Select>
         <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            {allSkills.map(skill => <SelectItem key={skill} value={skill}>{skill === 'all' ? 'All Skills' : skill}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-60 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map(student => (
              <StudentCard key={student.uid} student={student} onViewProfile={handleViewProfile} />
            ))}
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-muted-foreground">No students found matching your criteria.</p>
            </div>
          )}
        </>
      )}

      <StudentProfileDialog
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onOpenChange={(isOpen) => !isOpen && setSelectedStudent(null)}
        onNavigateToMessages={onNavigateToMessages}
      />
    </div>
  );
}
