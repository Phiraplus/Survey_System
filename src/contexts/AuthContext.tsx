import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import type { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | { uid: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enableDemoMode: (role: UserRole) => void;
  disableDemoMode: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | { uid: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check if we have a mock session in local storage for demo mode
  useEffect(() => {
    const savedDemo = localStorage.getItem('survey_demo_user');
    if (savedDemo) {
      try {
        const demoProfile = JSON.parse(savedDemo) as UserProfile;
        setUser({ uid: demoProfile.uid, email: demoProfile.email });
        setProfile(demoProfile);
        setIsDemoMode(true);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('survey_demo_user');
      }
    }

    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: 'Attendee',
              lastName: 'Delegate',
              country: 'TH',
              role: 'attendee'
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (e) {
          console.error('Failed to load Firestore profile:', e);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      throw new Error('Please disable Demo Mode first to log in with actual Firebase Auth.');
    }
    if (!auth) {
      throw new Error('Firebase Auth is not configured.');
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        localStorage.removeItem('survey_demo_user');
        setIsDemoMode(false);
        setUser(null);
        setProfile(null);
      } else if (auth) {
        await signOut(auth);
      }
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  const enableDemoMode = useCallback((role: UserRole) => {
    const mockProfile: UserProfile = {
      uid: `mock_${role}_${Date.now()}`,
      email: `${role}@demo.com`,
      firstName: role === 'admin' ? 'System' : 'John',
      lastName: role === 'admin' ? 'Administrator' : 'Doe',
      country: 'TH',
      role: role
    };
    localStorage.setItem('survey_demo_user', JSON.stringify(mockProfile));
    setUser({ uid: mockProfile.uid, email: mockProfile.email });
    setProfile(mockProfile);
    setIsDemoMode(true);
  }, []);

  const disableDemoMode = useCallback(() => {
    localStorage.removeItem('survey_demo_user');
    setIsDemoMode(false);
    setUser(null);
    setProfile(null);
  }, []);

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin' || profile?.role === 'superadmin';
  }, [profile]);

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    logout,
    enableDemoMode,
    disableDemoMode,
    isDemoMode
  }), [user, profile, loading, isAdmin, login, logout, enableDemoMode, disableDemoMode, isDemoMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
