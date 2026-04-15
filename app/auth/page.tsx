'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Film, Play, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'audience' | 'studio' | 'admin'>('audience');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile/edit`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Hard redirect so AuthContext re-initialises with the new session
        window.location.href = '/';
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName,
              role: role
            }
          }
        });
        if (error) throw error;

        if (data.user && !data.session) {
          // Email confirmation required
          setError('✅ Check your email to confirm your account before signing in.');
        } else if (data.session) {
          window.location.href = '/';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    const adminProfile = {
      id: 'demo-admin-id',
      display_name: 'DCSB Auditor (Demo)',
      role: 'admin',
      bio: 'System Administrator & Governance Auditor',
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin&backgroundColor=ff1b1c'
    };
    localStorage.setItem('nexa-demo-session', JSON.stringify(adminProfile));
    window.location.href = '/';
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass">
        <div className="auth-header">
          <div className="logo">WORLD <span>WOOD</span></div>
          <h1>
            {isForgotPassword 
              ? 'Reset Password' 
              : isLogin ? 'Welcome Back' : 'Join the Cinema'}
          </h1>
          <p>
            {isForgotPassword 
              ? 'Enter your email to receive a recovery link.'
              : isLogin ? 'Sign in to access your cinema experience.' : 'Create your digital cinema identity.'}
          </p>
        </div>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="auth-form">
            {!resetSent ? (
              <>
                <div className="input-group">
                  <label><Mail size={16} /> Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="error-msg">{error}</div>}
                <button type="submit" className="btn-primary full-width" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </>
            ) : (
              <div className="success-state">
                <CheckCircle size={48} className="success-icon" />
                <p>Recovery link sent to <strong>{email}</strong>. Check your inbox to reset your password.</p>
              </div>
            )}
            <button 
              type="button" 
              onClick={() => { setIsForgotPassword(false); setResetSent(false); }} 
              className="toggle-btn"
              style={{ marginTop: '1rem' }}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <label><User size={16} /> Display Name</label>
                <input
                  type="text"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label><Mail size={16} /> Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <label style={{ margin: 0 }}><Lock size={16} /> Password</label>
                <button 
                  type="button" 
                  className="forgot-link"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isForgotPassword}
              />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {!isForgotPassword && (
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          )}

          <div className="demo-access" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Internal Testing</p>
            <button 
              onClick={handleDemoAdmin}
              className="btn-glass" 
              style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', opacity: 0.6, transition: '0.3s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              <ShieldCheck size={18} /> Run DCSB Admin Mode
            </button>
          </div>
        </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(circle at center, #1a1a1a 0%, #050505 100%);
        }
        .auth-container {
          width: 500px;
          padding: 4rem;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(20px);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .auth-header h1 {
          font-size: 2rem;
          font-weight: 900;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .auth-header p {
          color: var(--grey);
          font-size: 0.9rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .input-group label {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--grey);
          margin-bottom: 0.8rem;
          text-transform: uppercase;
        }
        .input-group input {
          width: 100%;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 1.2rem;
          border-radius: 12px;
          color: white;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          transition: var(--transition);
        }
        .input-group input:focus {
          border-color: var(--accent);
          outline: none;
          background: rgba(0,0,0,0.6);
          box-shadow: 0 0 15px rgba(255,27,28,0.1);
        }

        .forgot-link {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.7;
        }
        .forgot-link:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .success-state {
          text-align: center;
          padding: 2rem;
          background: rgba(0, 255, 136, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(0, 255, 136, 0.1);
        }
        .success-icon {
          color: #00ff88;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.3));
        }
        .success-state p {
          font-size: 0.95rem;
          color: #ccc;
          line-height: 1.6;
        }

        .role-selector label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--grey);
          margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .role-options {
          display: flex;
          gap: 1rem;
        }
        .role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 1rem;
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          font-weight: 700;
          transition: var(--transition);
          color: var(--grey);
        }
        .role-btn.active {
          background: rgba(255,27,28,0.1);
          border-color: var(--accent);
          color: white;
        }
        .full-width {
          width: 100%;
          padding: 1.2rem;
          justify-content: center;
        }
        .error-msg {
          color: var(--accent);
          font-size: 0.8rem;
          text-align: center;
          font-weight: 600;
          padding: 1rem;
          background: rgba(255, 27, 28, 0.1);
          border-radius: 8px;
        }
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
        }
        .toggle-btn {
          font-size: 0.9rem;
          color: var(--grey);
          font-weight: 600;
        }
        .toggle-btn:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
