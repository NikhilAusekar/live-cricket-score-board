// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  password:string;
  email?: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Hardcoded admin users list
const adminUsers = [
  {
    username: 'nikhil.a@pravaltech.com',
    password: 'nikhil.a73@7378',
    email: 'nikhil.a@pravaltech.com',
  },

];

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        const matchedAdmin = adminUsers.find(
            (admin) => admin.username === parsedUser.username && admin.password === parsedUser.password
          );
        if(matchedAdmin){
          setUser(parsedUser);
        }

      } catch (error) {
        console.error('Invalid user in localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    const matchedAdmin = adminUsers.find(
      (admin) => admin.username === username && admin.password === password
    );

    if (matchedAdmin) {
      const user: User = {
        username: matchedAdmin.username,
        email: matchedAdmin.email,
        password : matchedAdmin.password,
        role: 'admin',
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    } else {
      setUser(null);
      localStorage.removeItem('user');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
