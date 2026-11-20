import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PublicUser,
  RegisterInput,
  AuthResponse,
  SecurityEventLog,
  authenticateUser,
  registerUser,
  getSessionUser,
  changePassword,
  getSecurityAuditLogs,
  getDatabaseInfo,
  recordSecurityEvent,
} from '@/lib/neon-auth.ts';

const SESSION_TOKEN_KEY = 'everything_market_jwt_token_v2';

interface AuthContextType {
  user: PublicUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'profile' | 'security';
  openAuthModal: (mode?: 'signin' | 'signup' | 'profile' | 'security') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'signin' | 'signup' | 'profile' | 'security') => void;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: RegisterInput) => Promise<AuthResponse>;
  logout: () => void;
  changeUserPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  dbInfo: ReturnType<typeof getDatabaseInfo>;
  securityLogs: SecurityEventLog[];
  refreshSecurityLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'profile' | 'security'>('signin');
  const [securityLogs, setSecurityLogs] = useState<SecurityEventLog[]>([]);

  const dbInfo = getDatabaseInfo();

  const refreshSecurityLogs = () => {
    const logs = getSecurityAuditLogs(user?.email);
    setSecurityLogs(logs);
  };

  // Restore session on startup
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = typeof window !== 'undefined' ? localStorage.getItem(SESSION_TOKEN_KEY) : null;
        if (savedToken) {
          const verifiedUser = await getSessionUser(savedToken);
          if (verifiedUser) {
            setUser(verifiedUser);
            setToken(savedToken);
          } else {
            localStorage.removeItem(SESSION_TOKEN_KEY);
          }
        }
      } catch (err) {
        console.error('Session restoration error:', err);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  // Update logs when user changes
  useEffect(() => {
    if (user) {
      refreshSecurityLogs();
    }
  }, [user]);

  const openAuthModal = (mode: 'signin' | 'signup' | 'profile' | 'security' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    const result = await authenticateUser(email, pass);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_TOKEN_KEY, result.token);
      }
      refreshSecurityLogs();
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const register = async (data: RegisterInput): Promise<AuthResponse> => {
    const result = await registerUser(data);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_TOKEN_KEY, result.token);
      }
      refreshSecurityLogs();
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const logout = () => {
    if (user) {
      recordSecurityEvent(user.email, 'LOGOUT', 'INFO', 'User logged out', user.id);
    }
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
    setSecurityLogs([]);
    setIsAuthModalOpen(false);
  };

  const changeUserPassword = async (currentPass: string, newPass: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const res = await changePassword(user.id, currentPass, newPass);
    if (res.success) {
      refreshSecurityLogs();
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        logout,
        changeUserPassword,
        dbInfo,
        securityLogs,
        refreshSecurityLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
