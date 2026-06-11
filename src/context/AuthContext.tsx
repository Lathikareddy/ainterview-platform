import React, { createContext, useContext, useEffect, useState } from 'react';
import store from '../utils/realtime';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  role?: string;
  targetRole?: string;
  targetCompany?: string;
}

interface StoredAccount {
  email: string;
  passwordHash: string;
  name: string;
  id: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  loginWithGoogle: (credentialResponse: any) => void;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithPassword: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash for passwords (demo only — not cryptographically secure)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const getStoredAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem('appAccounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveAccounts = (accounts: StoredAccount[]) => {
  try {
    localStorage.setItem('appAccounts', JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts:', e);
  }
};

// ── Per-user progress helpers ─────────────────────────────────────────
// Each user's interview progress is saved under their own key so switching
// accounts never mixes data.

const userProgressKey = (userId: string) => `appRealtimeState_${userId}`;

/** Save the current global realtime state into the user's personal slot. */
const saveUserProgress = (userId: string) => {
  try {
    const global = localStorage.getItem('appRealtimeState');
    if (global) {
      localStorage.setItem(userProgressKey(userId), global);
    }
  } catch {}
};

/** Load the user's saved progress into the global realtime slot so the rest
 *  of the app (which reads 'appRealtimeState') picks it up automatically. */
const loadUserProgress = (userId: string) => {
  try {
    const saved = localStorage.getItem(userProgressKey(userId));
    if (saved) {
      localStorage.setItem('appRealtimeState', saved);
    } else {
      // New user — start with a clean slate
      localStorage.removeItem('appRealtimeState');
    }
  } catch {}
  // Push the newly loaded state to all active store subscribers
  // so UI components reflect saved progress without requiring a page reload.
  store.reloadFromStorage();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ── Restore session on startup ─────────────────────────────────
    // If the user was already logged in (userProfile saved), restore them
    // so they don't have to log in again on every page refresh.
    try {
      const raw = localStorage.getItem('userProfile');
      if (raw) {
        const profile: UserProfile = JSON.parse(raw);
        setUser(profile);
        // Ensure their progress is loaded into the global slot
        loadUserProgress(profile.id);
      }
    } catch {
      localStorage.removeItem('userProfile');
    }
    setIsLoading(false);
  }, []);

  // ── Auto-save progress whenever localStorage 'appRealtimeState' changes ──
  // We piggyback on storage events so the user's progress is always mirrored
  // to their personal slot, even if they don't explicitly log out.
  useEffect(() => {
    if (!user) return;
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'appRealtimeState') {
        saveUserProgress(user.id);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [user]);

  const loginWithGoogle = (credentialResponse: any) => {
    try {
      let googleProfile;
      if (credentialResponse.profile) {
        googleProfile = credentialResponse.profile;
      } else if (credentialResponse.credential) {
        const credential = credentialResponse.credential;
        if (credential.includes('.')) {
          try {
            googleProfile = JSON.parse(atob(credential.split('.')[0]));
          } catch {
            googleProfile = JSON.parse(atob(credential.split('.')[1]));
          }
        }
      }
      if (!googleProfile) throw new Error('Could not parse Google profile');

      const profile: UserProfile = {
        id: googleProfile.sub,
        email: googleProfile.email,
        name: googleProfile.name,
        picture: googleProfile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleProfile.email}`,
        role: 'Software Engineer',
        targetRole: 'Senior Engineer',
        targetCompany: 'Your Target',
      };
      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('setupComplete', 'true');
      loadUserProgress(profile.id);
    } catch (e) {
      console.error('Failed to process Google credential:', e);
    }
  };

  const registerWithPassword = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password || !name) return { success: false, error: 'All fields are required' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Invalid email address' };
      if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

      const accounts = getStoredAccounts();
      if (accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email already registered. Please sign in.' };
      }

      const newAccount: StoredAccount = {
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        name,
        id: `user_${Date.now()}`,
      };
      accounts.push(newAccount);
      saveAccounts(accounts);

      const profile: UserProfile = {
        id: newAccount.id,
        email,
        name,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'Software Engineer',
        targetRole: 'Senior Engineer',
        targetCompany: 'Your Target',
      };
      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('userName', name);
      // New user starts with clean progress
      loadUserProgress(profile.id);
      // Note: setupComplete is NOT set here — new users go through the setup wizard

      return { success: true };
    } catch (e) {
      console.error('Registration failed:', e);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const loginWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password) return { success: false, error: 'Email and password are required' };

      const accounts = getStoredAccounts();
      const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

      if (!account) {
        return { success: false, error: 'No account found with this email. Please sign up first.' };
      }

      if (hashPassword(password) !== account.passwordHash) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const profile: UserProfile = {
        id: account.id,
        email: account.email,
        name: account.name,
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.email}`,
        role: 'Software Engineer',
        targetRole: 'Senior Engineer',
        targetCompany: 'Your Target',
      };
      setUser(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('setupComplete', 'true');

      // ── Restore this user's saved progress ───────────────────────
      loadUserProgress(profile.id);

      return { success: true };
    } catch (e) {
      console.error('Password login failed:', e);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    if (user) {
      // Save current progress to the user's personal slot before clearing
      saveUserProgress(user.id);
    }
    setUser(null);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('setupComplete');
    // Do NOT delete appRealtimeState here — it's already mirrored to the user's slot.
    // Clear the active global state so the next user starts fresh.
    localStorage.removeItem('appRealtimeState');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('userProfile', JSON.stringify(updated));

      // Also update the stored account name if name changed
      if (updates.name) {
        const accounts = getStoredAccounts();
        const idx = accounts.findIndex(a => a.id === user.id);
        if (idx >= 0) {
          accounts[idx].name = updates.name!;
          saveAccounts(accounts);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, loginWithPassword, registerWithPassword, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
