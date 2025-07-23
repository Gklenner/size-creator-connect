import { useState, useEffect, createContext, useContext } from "react";
import { User } from "@/types";

// Auth Context Type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, type: "affiliate" | "creator") => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock Auth Functions (será substituído pelo Supabase)
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulação de verificação de auth
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Verificar localStorage por agora
        const savedUser = localStorage.getItem('size_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - substituir por Supabase auth
      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        type: "affiliate", // Default
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('size_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, type: "affiliate" | "creator") => {
    setIsLoading(true);
    try {
      // Mock register - substituir por Supabase auth
      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name,
        email,
        type,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('size_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('size_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('size_user', JSON.stringify(updatedUser));
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };
};

export { AuthContext };