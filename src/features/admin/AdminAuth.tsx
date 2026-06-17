import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function AdminAuth() {
  const { login, register } = useAuth();
  const { addToast } = useToast();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all required fields.' });
      return;
    }

    if (isRegisterMode) {
      if (!firstName || !lastName) {
        addToast({ type: 'error', title: 'Validation Error', message: 'Please enter your first and last name.' });
        return;
      }
      if (password !== confirmPassword) {
        addToast({ type: 'error', title: 'Validation Error', message: 'Passwords do not match.' });
        return;
      }
      if (password.length < 6) {
        addToast({ type: 'error', title: 'Validation Error', message: 'Password must be at least 6 characters.' });
        return;
      }
    }

    setLoading(false);
    setLoading(true);
    try {
      if (isRegisterMode) {
        await register(email, password, firstName, lastName, 'admin');
        addToast({ type: 'success', title: 'Success', message: 'Admin account created successfully!' });
      } else {
        await login(email, password);
        addToast({ type: 'success', title: 'Welcome', message: 'Logged in as administrator.' });
      }
    } catch (err: unknown) {
      console.error(err);
      addToast({ 
        type: 'error', 
        title: isRegisterMode ? 'Registration Failed' : 'Login Failed', 
        message: (err as Error).message || 'An error occurred during authentication.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '65vh',
      padding: 'var(--space-4)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: 'var(--space-8)',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px) saturate(120%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sleek top glowing border line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--color-gold-500), var(--color-primary-800))'
        }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 'var(--space-2)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '50%'
          }}>
            🔒
          </div>
          <h2 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontWeight: 800, 
            fontSize: 'var(--text-2xl)',
            color: 'var(--color-primary-800)', 
            margin: '8px 0 0 0' 
          }}>
            {isRegisterMode ? 'Register Admin Account' : 'Admin Portal Access'}
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--text-xs)', 
            marginTop: '6px' 
          }}>
            {isRegisterMode ? 'Create credentials to manage the survey system.' : 'Please authenticate to access configuration and reports.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {isRegisterMode && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  style={{ height: '42px', fontSize: '13px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  style={{ height: '42px', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={{ height: '42px', fontSize: '13px' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ height: '42px', fontSize: '13px' }}
            />
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ height: '42px', fontSize: '13px' }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              height: '45px',
              fontSize: '14px',
              fontWeight: 700,
              marginTop: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--color-primary-800), var(--color-primary-950))',
              border: 'none',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
          >
            {loading ? (
              <span className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
            ) : (
              isRegisterMode ? 'Register' : 'Log In'
            )}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 'var(--space-4)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          {isRegisterMode ? (
            <span>
              Already have an admin account?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsRegisterMode(false);
                  setPassword('');
                  setConfirmPassword('');
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-gold-600)', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an admin account?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsRegisterMode(true);
                  setPassword('');
                }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-gold-600)', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
