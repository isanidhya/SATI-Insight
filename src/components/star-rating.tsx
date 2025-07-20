'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export function StarRating({ rating, maxRating = 5, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-4 w-4',
            index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
}
