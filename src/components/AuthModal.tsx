import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

type Mode = 'sign-in' | 'sign-up';
type Step = 'form' | 'verify';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp, signInWithOAuth, setPassword, isAnonymous } = useAuth();
  const [mode, setMode] = useState<Mode>(isAnonymous ? 'sign-up' : 'sign-in');
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword_] = useState('');
  const [pendingPassword, setPendingPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Listen for auth state changes to detect email verification
  useEffect(() => {
    if (step !== 'verify' || !pendingPassword) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'USER_UPDATED') {
        // Email verified — now set the password
        const { error: pwError } = await setPassword(pendingPassword);
        if (pwError) {
          setError(pwError.message);
        } else {
          onClose();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [step, pendingPassword, setPassword, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (mode === 'sign-in') {
      const result = await signIn(email, password);
      setSubmitting(false);
      if (result.error) {
        setError(result.error.message);
      } else {
        onClose();
      }
      return;
    }

    // Sign up (linking anonymous user)
    const result = await signUp(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error.message);
    } else if (result.needsVerification) {
      setPendingPassword(result.pendingPassword ?? password);
      setStep('verify');
    } else {
      onClose();
    }
  };

  const inputClass = "rounded border px-3 py-2 text-sm outline-none";
  const inputStyle = {
    background: 'var(--bg-surface)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-primary)',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg border p-6"
        style={{
          background: 'var(--dlg-bg)',
          borderColor: 'var(--dlg-border)',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'verify' ? (
          <>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--accent-gold)' }}>
              Check Your Email
            </h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              We sent a confirmation link to <strong>{email}</strong>.
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Click the link in the email to finish creating your account. You can close this dialog — your account will activate automatically.
            </p>
            {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
            <button
              className="rounded px-3 py-2 text-sm w-full cursor-pointer"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--accent-gold)' }}>
              {mode === 'sign-up' ? 'Create Account' : 'Sign In'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword_(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                style={inputStyle}
              />

              {error && <p className="text-xs text-red-400">{error}</p>}
              {success && <p className="text-xs text-green-400">{success}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="rounded px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
                style={{
                  background: 'var(--accent-gold)',
                  color: '#000',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? '...' : mode === 'sign-up' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-default)' }} />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="rounded border px-3 py-2 text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-hover)]"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                onClick={() => void signInWithOAuth('github')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                Continue with GitHub
              </button>
              <button
                type="button"
                className="rounded border px-3 py-2 text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface-hover)]"
                style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                onClick={() => void signInWithOAuth('google')}
              >
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              {mode === 'sign-up' ? (
                <>Already have an account?{' '}
                  <button className="underline cursor-pointer" style={{ color: 'var(--accent-gold-dim)' }} onClick={() => { setMode('sign-in'); setError(''); setSuccess(''); }}>
                    Sign in
                  </button>
                </>
              ) : (
                <>Need an account?{' '}
                  <button className="underline cursor-pointer" style={{ color: 'var(--accent-gold-dim)' }} onClick={() => { setMode('sign-up'); setError(''); setSuccess(''); }}>
                    Sign up
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
