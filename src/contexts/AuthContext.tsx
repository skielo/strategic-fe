"use client";
//
//import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
//import { useRouter } from 'next/navigation';
//
//interface AuthContextType {
//  isAuthenticated: boolean;
//  login: (accessToken: string, refreshToken: string) => void;
//  logout: () => void;
//}
//
//const AuthContext = createContext<AuthContextType | null>(null);
//
//export const useAuth = () => {
//  const context = useContext(AuthContext);
//  if (!context) {
//    throw new Error('useAuth must be used within an AuthProvider');
//  }
//  return context;
//};
//
//interface AuthProviderProps {
//  children: ReactNode;
//}
//
//export const AuthProvider = ({ children }: AuthProviderProps) => {
//  const [isAuthenticated, setIsAuthenticated] = useState(false);
//  const router = useRouter();
//
//  useEffect(() => {
//    // Check if user is authenticated on mount
//    const accessToken = localStorage.getItem('accessToken');
//    setIsAuthenticated(!!accessToken);
//  }, []);
//
//  const login = (accessToken: string, refreshToken: string) => {
//    localStorage.setItem('accessToken', accessToken);
//    localStorage.setItem('refreshToken', refreshToken);
//    setIsAuthenticated(true);
//  };
//
//  const logout = () => {
//    localStorage.removeItem('accessToken');
//    localStorage.removeItem('refreshToken');
//    setIsAuthenticated(false);
//    router.push('/login');
//  };
//
//  return (
//    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//      {children}
//    </AuthContext.Provider>
//  );
//};
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

//const AuthContext = createContext<AuthContextType>({
//  isAuthenticated: false,
//  token: null,
//  login: () => {},
//  logout: () => {},
//});
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
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
