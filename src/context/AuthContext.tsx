import React, { useEffect, useState, createContext, useContext } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('tdeeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);
  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // For demo purposes, any email/password combination works
        const mockUser = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email
        };
        setUser(mockUser);
        localStorage.setItem('tdeeUser', JSON.stringify(mockUser));
        resolve(true);
      }, 1000);
    });
  };
  // Mock signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const mockUser = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          name,
          email
        };
        setUser(mockUser);
        localStorage.setItem('tdeeUser', JSON.stringify(mockUser));
        resolve(true);
      }, 1000);
    });
  };
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tdeeUser');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    signup,
    logout,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
};