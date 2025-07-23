
'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import type { User as UserProfile } from '@/lib/types';

// We can extend this hook to get the GitHub access token if needed.
// For now, we'll mock it.
const MOCK_GITHUB_ACCESS_TOKEN = 'ghp_mock_token';

export const useUser = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(MOCK_GITHUB_ACCESS_TOKEN);

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
    githubAccessToken,
    refreshProfile: fetchUserProfile, // Expose a function to manually refresh data
  };
};
