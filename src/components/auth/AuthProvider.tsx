'use client';

import { type ReactNode, createContext, useState, useEffect } from 'react';
import { type User, type Role } from '@/types';
import { Skeleton } from '../ui/skeleton';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd check for a stored session here.
    // For this scaffold, we'll just end the loading state.
    const storedUser = localStorage.getItem('medi-secure-x2-user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
    setLoading(false);
  }, []);
  
  const login = (selectedRole: Role) => {
    setLoading(true);
    // This is a mock login. In a real app, you'd use Firebase Auth.
    const mockUser: User = {
      uid: '12345',
      name: 'Dr. Alex Chen',
      email: 'alex.chen@medisecure.dev',
      avatarUrl: `https://i.pravatar.cc/150?u=alexchen`,
      role: selectedRole,
    };
    setUser(mockUser);
    setRole(selectedRole);
    localStorage.setItem('medi-secure-x2-user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('medi-secure-x2-user');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
