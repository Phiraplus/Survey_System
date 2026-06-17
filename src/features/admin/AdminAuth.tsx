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
  const [adminPasscode, setAdminPasscode] = useState('');

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
      if (!adminPasscode) {
        addToast({ type: 'error', title: 'Validation Error', message: 'Please enter the Admin Registration Passcode.' });
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
        await register(email, password, firstName, lastName, 'admin', adminPasscode);
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
    <div className="admin-auth-container">
      <div className="card admin-auth-card">
        {/* Sleek top glowing border line */}
        <div className="admin-auth-top-line" />

        <div className="admin-auth-header">
          <div className="admin-auth-icon-box">
            🔒
          </div>
          <h2 className="admin-auth-title">
            {isRegisterMode ? 'Register Admin Account' : 'Admin Portal Access'}
          </h2>
          <p className="admin-auth-subtitle">
            {isRegisterMode ? 'Create credentials to manage the survey system.' : 'Please authenticate to access configuration and reports.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          {isRegisterMode && (
            <div className="admin-auth-grid">
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

          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Registration Passcode</label>
              <input
                type="password"
                className="form-input"
                value={adminPasscode}
                onChange={e => setAdminPasscode(e.target.value)}
                placeholder="Enter system passcode to register"
                required
                style={{ height: '42px', fontSize: '13px' }}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary admin-auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
            ) : (
              isRegisterMode ? 'Register' : 'Log In'
            )}
          </button>
        </form>

        <div className="admin-auth-footer">
          {isRegisterMode ? (
            <span>
              Already have an admin account?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setIsRegisterMode(false);
                  setPassword('');
                  setConfirmPassword('');
                  setAdminPasscode('');
                }}
                className="admin-auth-toggle-btn"
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
                  setAdminPasscode('');
                }}
                className="admin-auth-toggle-btn"
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
