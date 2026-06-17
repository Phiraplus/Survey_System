import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import { authAdapter } from '../services/db';
import type { UserProfile, UserRole } from '../types';
import type { UserSession } from '../services/db/types';

interface AuthContextType {
  user: UserSession | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    adminPasscode?: string
  ) => Promise<void>;
  enableDemoMode: (role: UserRole) => void;
  disableDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitor auth state changes dynamically via the selected auth adapter
  useEffect(() => {
    const unsubscribe = authAdapter.onAuthStateChanged((session) => {
      setUser(session);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await authAdapter.login(email, password);
      setUser(session);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authAdapter.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role: UserRole,
      adminPasscode?: string
    ) => {
      setLoading(true);
      try {
        const session = await authAdapter.register(
          email,
          password,
          firstName,
          lastName,
          role,
          adminPasscode || ''
        );
        setUser(session);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const enableDemoMode = useCallback((role: UserRole) => {
    const mockProfile = {
      uid: `mock_${role}_${Date.now()}`,
      email: `${role}@demo.com`,
      firstName: role === 'admin' ? 'System' : 'John',
      lastName: role === 'admin' ? 'Administrator' : 'Doe',
      role: role
    };
    localStorage.setItem('survey_demo_user', JSON.stringify(mockProfile));
    setUser(mockProfile);
  }, []);

  const disableDemoMode = useCallback(() => {
    localStorage.removeItem('survey_demo_user');
    setUser(null);
  }, []);

  const isDemoMode = useMemo(() => {
    const dbType = import.meta.env.VITE_DATABASE_TYPE || 'local';
    return dbType === 'local';
  }, []);

  const profile = useMemo<UserProfile | null>(() => {
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      country: 'TH', // Default fallback country
      role: user.role || 'attendee'
    };
  }, [user]);

  const isAdmin = useMemo(() => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: !!user,
      isAdmin,
      login,
      logout,
      register,
      enableDemoMode,
      disableDemoMode,
      isDemoMode
    }),
    [
      user,
      profile,
      loading,
      isAdmin,
      login,
      logout,
      register,
      enableDemoMode,
      disableDemoMode,
      isDemoMode
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
