import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ParticleBackground from '../components/3d/ParticleBackground';
import { Shield, Users, BarChart3, ArrowRight, Eye, EyeOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// EasySoftecH R mark — inline SVG
function EasySoftechMark({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#B03525"/>
      <rect x="8" y="8" width="5" height="24" rx="2" fill="white"/>
      <path d="M13 8 Q30 8 30 17 Q30 26 13 26" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="19" y1="24" x2="30" y2="32" stroke="white" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Login() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });
      navigate('/dashboard');
    } catch {
      setError('Could not connect to server. Make sure the backend is running.');
      setLoading(false);
    }
  };

  const features = [
    'Complete Employee Lifecycle Management',
    'Automated Payroll & Compliance Engine',
    'AI-powered HR Analytics & Insights',
    'Smart Recruitment Pipeline (ATS)',
    'Leave & Attendance Tracking',
    'Performance Reviews & Goal Management',
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', overflow: 'hidden' }}>
      <ParticleBackground />

      {/* Left Panel */}
      <div style={{
        flex: '1 1 55%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 64px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
          <EasySoftechMark size={52} />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 22, letterSpacing: 2, color: '#B03525', textTransform: 'uppercase' }}>EASY</span>
              <span style={{ fontFamily: 'var(--font-brand, Georgia, serif)', fontWeight: 700, fontSize: 26, color: 'var(--text-primary)', letterSpacing: 0.5 }}>SoftecH</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2, letterSpacing: 2, textTransform: 'uppercase' }}>HR Management Platform</div>
          </div>
        </div>

        {/* Hero text */}
        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20, maxWidth: 520 }}>
          Smarter{' '}
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            HR Management
          </span>
          {' '}Starts Here
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
          EasySoftecH HR — one unified platform for your entire employee lifecycle. From hire to retire, powered by intelligent automation.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-light)' }} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
          {[['50+', 'Employees'], ['10+', 'Modules'], ['100%', 'Compliant']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        flex: '0 0 420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 40px',
        background: 'rgba(13,18,32,0.85)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--border)',
        position: 'relative',
        zIndex: 1,
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Sign in to your EasySoftecH HR account</p>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Password</label>
              <div className="search-input-wrapper">
                <input
                  className="form-input"
                  id="password-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ color: 'var(--danger-light)', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', position: 'relative' }}
              id="login-btn"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 24 }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { flex: 1 !important; border-left: none !important; }
        }
      `}</style>
    </div>
  );
}
