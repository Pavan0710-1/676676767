import { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(asGuest?: boolean) {
    if (asGuest) {
      onLogin('Guest', 'guest@example.com');
      return;
    }
    if (!email) { setError('Enter your email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'User';
    onLogin(name, email);
  }

  return (
    <main
      id="main-content"
      aria-label="Sign in to MindClear"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 28px',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 60%), var(--bg)',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Logo lockup */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#13121e',
          borderRadius: '32px',
          padding: '20px 32px 18px',
          marginBottom: '32px',
          boxShadow: '0 0 0 1px rgba(108,99,255,0.18), 0 0 60px rgba(108,99,255,0.22), 0 8px 40px rgba(0,0,0,0.5)',
          gap: '6px',
        }}
      >
        <img
          src="/logo.png"
          alt=""
          style={{ width: '88px', height: '88px', display: 'block' }}
          draggable={false}
        />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: 700,
          letterSpacing: '0.3px',
          color: '#fff',
          lineHeight: 1,
        }}>
          MindClear
        </span>
      </div>

      <p style={{ color: 'var(--text2)', textAlign: 'center', fontSize: 'var(--font-size-base)', marginBottom: '36px', marginTop: '-12px' }}>
        Your thoughts, organised instantly
      </p>

      <form
        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        aria-label="Sign in form"
        style={{ width: '100%' }}
        noValidate
      >
        <div style={{ marginBottom: '14px' }}>
          <label
            htmlFor="login-email"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!error && !email}
            aria-describedby={error ? 'login-error' : undefined}
            style={{
              width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-base)', padding: '14px 16px', outline: 'none',
            }}
          />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label
            htmlFor="login-password"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text2)', marginBottom: '8px' }}
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={!!error && password.length < 6}
            aria-describedby={error ? 'login-error' : undefined}
            style={{
              width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-base)', padding: '14px 16px', outline: 'none',
            }}
          />
        </div>

        {error && (
          <div
            id="login-error"
            role="alert"
            aria-live="polite"
            style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '12px' }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 24px', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', fontWeight: 600,
            cursor: 'pointer', border: 'none',
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            color: '#fff', width: '100%',
            boxShadow: '0 4px 20px var(--accent-glow)',
          }}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => handleSubmit(true)}
          aria-label="Continue as a guest without an account"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 24px', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--font-size-base)', fontWeight: 600,
            cursor: 'pointer',
            background: 'var(--surface2)', color: 'var(--text2)',
            border: '1px solid var(--border)', width: '100%', marginTop: '10px',
          }}
        >
          Continue as Guest
        </button>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text3)' }}>
          Demo: any email + 6+ char password
        </p>
      </form>
    </main>
  );
}
