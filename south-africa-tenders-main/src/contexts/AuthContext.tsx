import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  plan: 'free' | 'basic' | 'pro';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication - replace with real API calls
  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('tender_hub_user');
    const storedOrg = localStorage.getItem('tender_hub_org');
    
    if (storedUser && storedOrg) {
      setUser(JSON.parse(storedUser));
      setOrganization(JSON.parse(storedOrg));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      setUser(response.user);
      setOrganization(response.organization);
      
      localStorage.setItem('tender_hub_user', JSON.stringify(response.user));
      localStorage.setItem('tender_hub_org', JSON.stringify(response.organization));
      localStorage.setItem('tender_hub_token', response.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.register(userData);
      
      setUser(response.user);
      setOrganization(response.organization);
      
      localStorage.setItem('tender_hub_user', JSON.stringify(response.user));
      localStorage.setItem('tender_hub_org', JSON.stringify(response.organization));
      localStorage.setItem('tender_hub_token', response.token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('tender_hub_user');
    localStorage.removeItem('tender_hub_org');
    localStorage.removeItem('tender_hub_token');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}