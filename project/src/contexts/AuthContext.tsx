import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'author' | 'admin';
  genres?: string[];
  bio?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (code: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  pendingVerification: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPending = localStorage.getItem('pendingVerification');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedPending) {
      setPendingVerification(savedPending);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email === 'demo@blog.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        name: 'Demo Author',
        email: 'demo@blog.com',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
        role: 'author',
        emailVerified: true,
        genres: ['Technology', 'Web Development'],
        bio: 'Passionate about creating amazing web experiences'
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setPendingVerification(null);
      localStorage.removeItem('pendingVerification');
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    try {
      // Check if user already exists
      if (email === 'demo@blog.com') {
        return { success: false, message: 'User with this email already exists' };
      }

      // Simulate successful registration
      setPendingVerification(email);
      localStorage.setItem('pendingVerification', email);
      
      return { success: true, message: 'Registration successful! Please check your email for verification code.' };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    // Simulate email verification
    if (code === '123456' && pendingVerification) {
      const newUser: User = {
        id: Date.now().toString(),
        name: 'New User',
        email: pendingVerification,
        role: 'author',
        emailVerified: true,
        avatar: undefined,
        genres: [],
        bio: ''
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setPendingVerification(null);
      localStorage.removeItem('pendingVerification');
      return true;
    }
    return false;
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setPendingVerification(null);
    localStorage.removeItem('user');
    localStorage.removeItem('pendingVerification');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      verifyEmail, 
      updateProfile, 
      logout, 
      loading, 
      pendingVerification 
    }}>
      {children}
    </AuthContext.Provider>
  );
}