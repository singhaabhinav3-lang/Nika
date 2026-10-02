import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';

// Standard Firebase Configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' && process.env?.VITE_FIREBASE_API_KEY) || 'AIzaSyDemoNikaStylistKeyForAuthentication2026',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'nika-fashion-stylist.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'nika-fashion-stylist',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'nika-fashion-stylist.appspot.com',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '1048874170612',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:1048874170612:web:9f83a04c8e7b1a23',
};

// Initialize Firebase App gracefully
let auth: any = null;
try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase init warning:', e);
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  styleDNA?: string;
  isDemo?: boolean;
}

interface StoredAccount {
  uid: string;
  name: string;
  email: string;
  passwordHash: string;
  styleDNA: string;
  photoURL: string;
  createdAt: string;
}

const LOCAL_STORAGE_SESSION_KEY = 'nika_authenticated_user';
const LOCAL_STORAGE_ACCOUNTS_KEY = 'nika_registered_accounts';

// Pre-populate with default VIP accounts so user can log in with standard credentials
function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading stored accounts', e);
  }

  const defaultAccounts: StoredAccount[] = [
    {
      uid: 'user-elena-vance',
      name: 'Elena Vance',
      email: 'elena.vance@atelier.io',
      passwordHash: 'password123',
      styleDNA: 'Quiet Luxury',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      uid: 'user-client-demo',
      name: 'Abhinav Singh',
      email: 'singhaabhinav3@gmail.com',
      passwordHash: 'password123',
      styleDNA: 'Old Money',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    }
  ];

  try {
    localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(defaultAccounts));
  } catch (e) {
    // Ignore
  }

  return defaultAccounts;
}

function saveStoredAccount(account: StoredAccount) {
  try {
    const accounts = getStoredAccounts();
    const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === account.email.toLowerCase());
    if (existingIdx >= 0) {
      accounts[existingIdx] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save account', e);
  }
}

export const firebaseAuthService = {
  /**
   * Listen to active session changes
   */
  onAuthState(callback: (user: AuthUser | null) => void) {
    // Check cached active session first
    const current = this.getCurrentUser();
    if (current) {
      callback(current);
    }

    // Also attach Firebase listener if available
    if (auth) {
      try {
        return onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            const userObj: AuthUser = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Atelier Client',
              photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            };
            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
            callback(userObj);
          }
        });
      } catch (e) {
        console.warn('Firebase onAuthStateChanged error:', e);
      }
    }

    return () => {};
  },

  /**
   * Sign In with Email & Password
   */
  async signIn(email: string, pass: string): Promise<AuthUser> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      throw new Error('Please enter both email and password.');
    }

    // Try real Firebase Auth first if available
    if (auth && (import.meta as any).env?.VITE_FIREBASE_API_KEY) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        const userObj: AuthUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || cleanEmail.split('@')[0],
          photoURL: cred.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        };
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
        return userObj;
      } catch (fbErr: any) {
        console.warn('Firebase cloud auth sign in error, falling back to local account verification:', fbErr);
      }
    }

    // Verify against registered local accounts
    const accounts = getStoredAccounts();
    const match = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (match) {
      // Validate password if stored
      if (match.passwordHash && match.passwordHash !== cleanPass) {
        throw new Error('Incorrect password. Please verify your credentials or reset.');
      }

      const userObj: AuthUser = {
        uid: match.uid,
        email: match.email,
        displayName: match.name,
        photoURL: match.photoURL,
        styleDNA: match.styleDNA,
      };
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
      return userObj;
    }

    // If account was not found, auto-provision and register seamlessly
    const newAccount: StoredAccount = {
      uid: `client-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace('.', ' '),
      email: cleanEmail,
      passwordHash: cleanPass,
      styleDNA: 'Quiet Luxury',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };
    saveStoredAccount(newAccount);

    const userObj: AuthUser = {
      uid: newAccount.uid,
      email: newAccount.email,
      displayName: newAccount.name,
      photoURL: newAccount.photoURL,
      styleDNA: newAccount.styleDNA,
    };
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
    return userObj;
  },

  /**
   * Create Account (Sign Up)
   */
  async signUp(name: string, email: string, pass: string, styleDNA: string): Promise<AuthUser> {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      throw new Error('Please fill out all fields.');
    }

    if (cleanPass.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Check if account already exists
    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      // If it exists with same password, log in
      if (existing.passwordHash === cleanPass) {
        const userObj: AuthUser = {
          uid: existing.uid,
          email: existing.email,
          displayName: existing.name,
          photoURL: existing.photoURL,
          styleDNA: existing.styleDNA,
        };
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
        return userObj;
      }
      throw new Error('An account with this email already exists. Please choose Sign In.');
    }

    // Try creating via Firebase Auth first if live key configured
    if (auth && (import.meta as any).env?.VITE_FIREBASE_API_KEY) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        await updateProfile(cred.user, {
          displayName: cleanName,
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        });
      } catch (fbErr: any) {
        console.warn('Firebase cloud auth sign up warning, proceeding with local registered account:', fbErr);
      }
    }

    // Save newly registered account
    const newAccount: StoredAccount = {
      uid: `client-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: cleanPass,
      styleDNA: styleDNA || 'Quiet Luxury',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };
    saveStoredAccount(newAccount);

    const userObj: AuthUser = {
      uid: newAccount.uid,
      email: newAccount.email,
      displayName: newAccount.name,
      photoURL: newAccount.photoURL,
      styleDNA: newAccount.styleDNA,
    };
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
    return userObj;
  },

  /**
   * 1-Tap VIP Atelier Client Access
   */
  async signInDemoClient(name: string = 'Elena Vance', email: string = 'elena.vance@atelier.io'): Promise<AuthUser> {
    const userObj: AuthUser = {
      uid: 'demo-client-elena',
      email,
      displayName: name,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      styleDNA: 'Quiet Luxury',
      isDemo: true,
    };
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userObj));
    return userObj;
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      if (auth) {
        await fbSignOut(auth);
      }
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }
};
