import { createContext, useContext, useEffect, useState, useMemo, useCallback, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole, adminPasscode?: string) => Promise<void>;
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
    setLoading(true);
    try {
      if (!isFirebaseConfigured || !auth) {
        // Mock fallback login using local storage registered users
        const mockUsersStr = localStorage.getItem('survey_mock_registered_users') || '[]';
        const mockUsers = JSON.parse(mockUsersStr);
        const found = mockUsers.find((u: any) => u.email === email && u.password === password);
        if (!found) {
          throw new Error('Invalid email or password.');
        }
        const { password: _, ...newProfile } = found;
        localStorage.setItem('survey_demo_user', JSON.stringify(newProfile));
        setUser({ uid: newProfile.uid, email: newProfile.email });
        setProfile(newProfile);
        setIsDemoMode(true);
        return;
      }
      
      if (isDemoMode) {
        throw new Error('Please disable Demo Mode first to log in with actual Firebase Auth.');
      }
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemoMode || !isFirebaseConfigured) {
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

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string, role: UserRole, adminPasscode?: string) => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured || !auth) {
        // Mock fallback register in local storage
        const mockUsersStr = localStorage.getItem('survey_mock_registered_users') || '[]';
        const mockUsers = JSON.parse(mockUsersStr);
        if (mockUsers.find((u: any) => u.email === email)) {
          throw new Error('User already exists in mock database.');
        }

        // In mock mode, check if the admin passcode matches the default one
        if (role === 'admin' && adminPasscode !== 'SurveyAdmin2026') {
          throw new Error('Invalid Admin Registration Passcode.');
        }

        const uid = `mock_user_${Date.now()}`;
        const newProfile: UserProfile = {
          uid,
          email,
          firstName,
          lastName,
          country: 'TH',
          role
        };
        mockUsers.push({ ...newProfile, password });
        localStorage.setItem('survey_mock_registered_users', JSON.stringify(mockUsers));

        localStorage.setItem('survey_demo_user', JSON.stringify(newProfile));
        setUser({ uid, email });
        setProfile(newProfile);
        setIsDemoMode(true);
        return;
      }

      if (isDemoMode) {
        throw new Error('Please disable Demo Mode first to register with actual Firebase Auth.');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      if (db) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const newProfile: UserProfile & { adminPasscode?: string } = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || email,
          firstName,
          lastName,
          country: 'TH',
          role,
          adminPasscode
        };
        await setDoc(docRef, newProfile);
        
        // Clean up passcode from local React state
        const { adminPasscode: _, ...profileForState } = newProfile;
        setProfile(profileForState);
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
    register,
    enableDemoMode,
    disableDemoMode,
    isDemoMode
  }), [user, profile, loading, isAdmin, login, logout, register, enableDemoMode, disableDemoMode, isDemoMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
