import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios'; // You might need to install axios first

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean | string>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tdeeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true); // Start loading
    try {
      interface LoginResponse {
        user: User;
      }
  
      // Simulated delay para sa loading state (e.g. 2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const response = await axios.post<LoginResponse>('/api/users/login', { email, password });
      const loggedInUser = response.data.user;
      setUser(loggedInUser);
      localStorage.setItem('tdeeUser', JSON.stringify(loggedInUser));
      return true;
    } catch (err) {
      console.error('Login failed:', email, password, err);
      return false;
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  const signup = async (name: string, email: string, password: string): Promise<boolean | string> => {
    setIsLoading(true); // Start loading
    try {
      interface SignupResponse {
        user: User;
      }
  
      // Simulated delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const response = await axios.post<SignupResponse>('/api/users/signup', {
        name,
        email,
        password
      });
      
      const newUser = response.data.user;
      setUser(newUser);
      localStorage.setItem('tdeeUser', JSON.stringify(newUser));
      return true;
    } catch (err: any) {
      console.error('Signup failed:', err.response?.data || err.message);
  
      if (err.response?.data?.error === 'User already exists') {
        return 'Email already exists';
      } else {
        return 'An error occurred during signup. Please try again.';
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tdeeUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};