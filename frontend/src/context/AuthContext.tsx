import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'Admin' | 'Commander' | 'Logistics';

export interface User {
  username: string;
  role: Role;
  base: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user credentials per role
const MOCK_USERS: Record<Role, { username: string; password: string; base: string }> = {
  Admin: { username: 'admin_user', password: 'password', base: 'Global Operations HQ' },
  Commander: { username: 'commander_user', password: 'password', base: 'Fort Alpha' },
  Logistics: { username: 'logistics_user', password: 'password', base: 'Camp Bravo' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) sessionStorage.setItem('auth_user', JSON.stringify(user));
    else sessionStorage.removeItem('auth_user');
  }, [user]);

  const login = (username: string, password: string, role: Role): boolean => {
    const mock = MOCK_USERS[role];
    if (username === mock.username && password === mock.password) {
      setUser({ username, role, base: mock.base });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
