'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '@/lib/services/auth.service';

interface User {
  id: string;
  username: string;
  full_name: string;
  subscription_plan: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = AuthService.getUser();
    setUser(storedUser);
    setLoading(false);
  }, []);

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}
