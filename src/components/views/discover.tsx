'use client';

import { useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentCard } from '@/components/student-card';
import { StudentProfileDialog } from '@/components/student-profile-dialog';
import { Search } from 'lucide-react';

export function DiscoverView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [academicYear, setAcademicYear] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const filteredStudents = useMemo(() => {
    return MOCK_USERS.filter(student => {
      const matchesYear = academicYear === 'all' || student.academicYear === parseInt(academicYear, 10);
      const matchesQuery =
        searchQuery === '' ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some(skill => skill.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesYear && matchesQuery;
    });
  }, [searchQuery, academicYear]);

  const handleViewProfile = (student: User) => {
    setSelectedStudent(student);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or skill..."
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
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStudents.map(student => (
          <StudentCard key={student.id} student={student} onViewProfile={handleViewProfile} />
        ))}
      </div>
      
      {filteredStudents.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No students found matching your criteria.</p>
        </div>
      )}

      <StudentProfileDialog
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onOpenChange={(isOpen) => !isOpen && setSelectedStudent(null)}
      />
    </div>
  );
}
