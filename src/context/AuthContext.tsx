import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('safeband_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user credentials', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<User> => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock verification (any password works for demo)
    const mockUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].toUpperCase(),
      email,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('safeband_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  const signup = async (name: string, email: string, _password: string): Promise<User> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      name: name,
      email,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('safeband_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem('safeband_user');
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    if (!user) throw new Error('No authenticated user found');
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUser = { ...user, ...updates };
    localStorage.setItem('safeband_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setLoading(false);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
