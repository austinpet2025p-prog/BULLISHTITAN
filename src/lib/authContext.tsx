import React, { createContext, useContext, useEffect, useState } from 'react';

export type PlanTier = 'free' | 'academy' | 'signals' | 'mentorship' | 'full-access' | 'investor';

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: 'Observer Preview',
  academy: 'Forge Initiate',
  signals: 'Vanguard Intelligence',
  mentorship: 'Strategos Desk',
  'full-access': 'Sovereign Titan Order',
  investor: 'Sovereign Mandate',
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  streakDays: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string, plan?: PlanTier) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updatePlan: (plan: PlanTier) => void;
  updateProfile: (name: string) => void;
  completedLessons: string[];
  toggleLessonComplete: (lessonId: string) => void;
}

const STORAGE_USER_KEY = 'bt_academy_user_v1';
const STORAGE_LESSONS_KEY = 'bt_academy_lessons_v1';
const STORAGE_THEME_KEY = 'bt_academy_theme_v1';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_LESSONS_KEY);
      return raw
        ? (JSON.parse(raw) as string[])
        : ['foundations-fx-synthetics:0:0', 'foundations-fx-synthetics:0:1', 'foundations-fx-synthetics:1:0'];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const persistUser = (next: AuthUser | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_USER_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const loginWithEmail = async (email: string, _password: string) => {
    const nameFromEmail = email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Phalanx Member';
    const prettyName = nameFromEmail.replace(/\b\w/g, (c) => c.toUpperCase());
    persistUser({
      id: 'demo-uid-101',
      name: prettyName,
      email,
      plan: 'academy',
      streakDays: 6,
    });
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    _password: string,
    plan: PlanTier = 'free'
  ) => {
    persistUser({
      id: `demo-uid-${Date.now()}`,
      name: name.trim() || 'Academy Initiate',
      email: email.trim(),
      plan,
      streakDays: 1,
    });
  };

  const loginWithGoogle = async () => {
    persistUser({
      id: 'demo-google-uid',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      plan: 'full-access',
      streakDays: 12,
    });
  };

  const logout = () => persistUser(null);

  const updatePlan = (plan: PlanTier) => {
    if (!user) return;
    persistUser({ ...user, plan });
  };

  const updateProfile = (name: string) => {
    if (!user) return;
    persistUser({ ...user, name });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem(STORAGE_LESSONS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        theme,
        toggleTheme,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        updatePlan,
        updateProfile,
        completedLessons,
        toggleLessonComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function canAccessArea(plan: PlanTier, area: 'overview' | 'courses' | 'signals' | 'mentorship' | 'investor' | 'settings'): boolean {
  if (area === 'overview' || area === 'settings') return true;
  if (plan === 'full-access') return true;
  if (area === 'courses') return plan === 'academy' || plan === 'mentorship';
  if (area === 'signals') return plan === 'signals' || plan === 'mentorship';
  if (area === 'mentorship') return plan === 'mentorship';
  if (area === 'investor') return plan === 'investor';
  return false;
}
