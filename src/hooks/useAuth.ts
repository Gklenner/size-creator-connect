import { useState, useEffect, createContext, useContext } from "react";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";

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
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('size_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar se usuário já existe
      const existingUsers = JSON.parse(localStorage.getItem('size_users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (!existingUser) {
        throw new Error('Usuário não encontrado. Faça seu cadastro primeiro.');
      }

      // Verificar senha (mock - em produção usar hash)
      const savedPassword = localStorage.getItem(`size_password_${existingUser.uid}`);
      if (savedPassword !== password) {
        throw new Error('Senha incorreta');
      }
      
      setUser(existingUser);
      localStorage.setItem('size_user', JSON.stringify(existingUser));
      localStorage.setItem('size_last_login', new Date().toISOString());
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
      // Validações
      if (!name || !email || !password) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Verificar se email já existe
      const existingUsers = JSON.parse(localStorage.getItem('size_users') || '[]');
      if (existingUsers.find((u: User) => u.email === email)) {
        throw new Error('Este email já está cadastrado');
      }

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        name,
        email,
        type,
        createdAt: new Date(),
      };
      
      // Salvar usuário na lista
      existingUsers.push(mockUser);
      localStorage.setItem('size_users', JSON.stringify(existingUsers));
      localStorage.setItem(`size_password_${mockUser.uid}`, password);
      
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
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('size_user', JSON.stringify(updatedUser));
    
    // Atualizar na lista de usuários também
    const existingUsers = JSON.parse(localStorage.getItem('size_users') || '[]');
    const updatedUsers = existingUsers.map((u: User) => 
      u.uid === user.uid ? updatedUser : u
    );
    localStorage.setItem('size_users', JSON.stringify(updatedUsers));
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