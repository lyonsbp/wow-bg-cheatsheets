import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

type Mode = 'sign-in' | 'sign-up';
type Step = 'form' | 'verify';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp, setPassword, isAnonymous } = useAuth();
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
