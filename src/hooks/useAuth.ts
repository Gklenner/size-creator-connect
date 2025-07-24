import { useCallback } from "react";
import { useStore } from "@/store/useStore";
import { User } from "@/types";
import { LoginFormData, RegisterFormData } from "@/lib/validations";

// Mock database simulation
const USERS_KEY = 'size_users';
const USER_KEY = 'size_user';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setLoading, 
    logout: storeLogout,
    addNotification 
  } = useStore();

  const login = useCallback(async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Get existing users
      const existingUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const existingUser = existingUsers.find(u => u.email === data.email);
      
      if (!existingUser) {
        throw new Error('Usuário não encontrado. Faça seu cadastro primeiro.');
      }

      // Check password (in production, this would be hashed)
      const savedPassword = localStorage.getItem(`size_password_${existingUser.uid}`);
      if (savedPassword !== data.password) {
        throw new Error('Senha incorreta');
      }
      
      // Update last login
      const updatedUser = {
        ...existingUser,
        lastLogin: new Date(),
      };
      
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem('size_last_login', new Date().toISOString());
      
      addNotification({
        type: 'success',
        message: `Bem-vindo de volta, ${updatedUser.name}!`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido no login';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, addNotification]);

  const register = useCallback(async (data: RegisterFormData): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get existing users
      const existingUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      // Check if email already exists
      if (existingUsers.find(u => u.email === data.email)) {
        throw new Error('Este email já está cadastrado');
      }

      // Create new user
      const newUser: User = {
        uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        type: data.type,
        createdAt: new Date(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
        bio: data.type === 'creator' 
          ? 'Criador de produtos digitais' 
          : 'Afiliado especializado em marketing digital',
      };
      
      // Save user
      existingUsers.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
      localStorage.setItem(`size_password_${newUser.uid}`, data.password);
      
      setUser(newUser);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      
      addNotification({
        type: 'success',
        message: `Conta criada com sucesso! Bem-vindo, ${newUser.name}!`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido no cadastro';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, addNotification]);

  const logout = useCallback(() => {
    storeLogout();
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('size_last_login');
    
    addNotification({
      type: 'success',
      message: 'Logout realizado com sucesso'
    });
  }, [storeLogout, addNotification]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      const existingUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const updatedUsers = existingUsers.map(u => 
        u.uid === user.uid ? updatedUser : u
      );
      
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      
      addNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      addNotification({
        type: 'error',
        message
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, setUser, setLoading, addNotification]);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Check if user is stored
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };
};