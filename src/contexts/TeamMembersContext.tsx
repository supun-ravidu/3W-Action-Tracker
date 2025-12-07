'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  department?: string;
  joinDate?: Date;
  workload?: number;
}

interface TeamMembersContextType {
  members: TeamMember[];
  loading: boolean;
  isConnected: boolean;
  error: Error | null;
  count: number;
  refetch: () => Promise<void>;
}

const TeamMembersContext = createContext<TeamMembersContextType | undefined>(undefined);

export function TeamMembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, 'teamMembers'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const teamMembers = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          role: data.role,
          department: data.department,
          workload: data.workload || 0,
          joinDate: data.createdAt?.toDate?.() || new Date(),
        } as TeamMember;
      });
      setMembers(teamMembers);
      setLoading(false);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Team members fetch error:', err);
      setIsConnected(false);
      setLoading(false);
      setError(err as Error);
    }
  };

  useEffect(() => {
    // Initial fetch only - NO real-time subscription
    fetchMembers();
    
    // Poll every 30 minutes to drastically reduce quota usage
    const interval = setInterval(fetchMembers, 1800000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <TeamMembersContext.Provider
      value={{
        members,
        loading,
        isConnected,
        error,
        count: members.length,
        refetch: fetchMembers,
      }}
    >
      {children}
    </TeamMembersContext.Provider>
  );
}

export function useTeamMembers() {
  const context = useContext(TeamMembersContext);
  if (context === undefined) {
    throw new Error('useTeamMembers must be used within a TeamMembersProvider');
  }
  return context;
}
