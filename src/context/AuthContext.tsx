import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  role?: string;
  targetRole?: string;
  targetCompany?: string;
  provider?: 'google' | 'password';
  createdAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithPassword: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Firestore helpers ────────────────────────────────────────────────────────
async function upsertUserInFirestore(fbUser: FirebaseUser, extra: Partial<UserProfile> = {}) {
  const ref = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      id: fbUser.uid,
      email: fbUser.email ?? '',
      name: fbUser.displayName ?? extra.name ?? '',
      picture: fbUser.photoURL ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.email}`,
      role: 'Software Engineer',
      targetRole: 'Senior Engineer',
      targetCompany: 'Your Target',
      provider: extra.provider ?? 'password',
      createdAt: new Date().toISOString(),
      lastLogin: serverTimestamp(),
    });
  } else {
    await updateDoc(ref, { lastLogin: serverTimestamp() });
  }
  const latest = await getDoc(ref);
  return latest.data() as UserProfile;
}

function mapFirebaseUser(fbUser: FirebaseUser, firestoreData?: UserProfile): UserProfile {
  return {
    id: fbUser.uid,
    email: fbUser.email ?? '',
    name: fbUser.displayName ?? firestoreData?.name ?? '',
    picture: fbUser.photoURL ?? firestoreData?.picture ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.email}`,
    role: firestoreData?.role ?? 'Software Engineer',
    targetRole: firestoreData?.targetRole ?? 'Senior Engineer',
    targetCompany: firestoreData?.targetCompany ?? 'Your Target',
    provider: firestoreData?.provider ?? 'password',
    createdAt: firestoreData?.createdAt,
  };
}

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/user-disabled': return 'This account has been disabled.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use': return 'Email already registered. Please sign in.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user': return 'Sign-in window was closed. Please try again.';
    case 'auth/network-request-failed': return 'Network error. Please check your connection.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/invalid-credential': return 'Incorrect email or password.';
    default: return 'Authentication failed. Please try again.';
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase Auth state — works across all devices automatically
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const ref = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(ref);
          const firestoreData = snap.exists() ? (snap.data() as UserProfile) : undefined;
          const profile = mapFirebaseUser(fbUser, firestoreData);
          setFirebaseUser(fbUser);
          setUser(profile);
          // Mirror to localStorage for offline reads / setup-complete check
          localStorage.setItem('userProfile', JSON.stringify(profile));
          if (firestoreData) {
            localStorage.setItem('setupComplete', 'true');
          }
        } catch (e) {
          console.error('Auth state error:', e);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem('userProfile');
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firestoreData = await upsertUserInFirestore(result.user, { provider: 'google' });
      const profile = mapFirebaseUser(result.user, firestoreData);
      setFirebaseUser(result.user);
      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('setupComplete', 'true');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: friendlyError(e.code) };
    }
  };

  // ── Email + Password Sign-In ────────────────────────────────────────────────
  const loginWithPassword = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password) return { success: false, error: 'Email and password are required.' };
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firestoreData = await upsertUserInFirestore(result.user);
      const profile = mapFirebaseUser(result.user, firestoreData);
      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('setupComplete', 'true');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: friendlyError(e.code) };
    }
  };

  // ── Register ────────────────────────────────────────────────────────────────
  const registerWithPassword = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password || !name) return { success: false, error: 'All fields are required.' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name in Firebase Auth
      await firebaseUpdateProfile(result.user, { displayName: name });
      // Store in Firestore
      const firestoreData = await upsertUserInFirestore(result.user, { name, provider: 'password' });
      const profile = mapFirebaseUser(result.user, firestoreData);
      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('userName', name);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: friendlyError(e.code) };
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('setupComplete');
    localStorage.removeItem('appRealtimeState');
  };

  // ── Update Profile ──────────────────────────────────────────────────────────
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!firebaseUser || !user) return;
    try {
      const ref = doc(db, 'users', firebaseUser.uid);
      await updateDoc(ref, { ...updates });
      if (updates.name) {
        await firebaseUpdateProfile(firebaseUser, { displayName: updates.name });
      }
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('userProfile', JSON.stringify(updated));
    } catch (e) {
      console.error('Profile update failed:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isLoading, loginWithGoogle, loginWithPassword, registerWithPassword, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
