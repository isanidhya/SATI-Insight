
'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import type { User as UserProfile } from '@/lib/types';


export const useUser = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    profile,
    loading: authLoading || loading,
    refreshProfile: fetchUserProfile, // Expose a function to manually refresh data
  };
};
