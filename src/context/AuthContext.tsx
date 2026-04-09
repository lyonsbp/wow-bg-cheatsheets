import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface SignUpResult {
  error: Error | null;
  needsVerification: boolean;
  pendingPassword?: string;
}

type OAuthProvider = 'google' | 'github';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAnonymous: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setPassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s) {
        supabase.auth.signInAnonymously().then(({ data }) => {
          setSession(data.session);
          setUser(data.user);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (isAnonymous) {
      // Step 1: Link email to anonymous user (sends verification email)
      const { error } = await supabase.auth.updateUser({ email });
      if (error) return { error, needsVerification: false };
      // Password will be set after email verification via setPassword()
      return { error: null, needsVerification: true, pendingPassword: password };
    }
    // Non-anonymous: standard sign up
    const { error } = await supabase.auth.signUp({ email, password });
    return { error, needsVerification: !error };
  };

  const setPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithOAuth = async (provider: OAuthProvider) => {
    if (isAnonymous) {
      const { error } = await supabase.auth.linkIdentity({
        provider,
        options: { redirectTo: window.location.origin },
      });
      return { error };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Create a new anonymous session after sign out
    const { data } = await supabase.auth.signInAnonymously();
    setSession(data.session);
    setUser(data.user);
  };

  const isAnonymous = user?.is_anonymous ?? true;

  return (
    <AuthContext.Provider value={{ user, session, isAnonymous, loading, signUp, signIn, signInWithOAuth, signOut, setPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
