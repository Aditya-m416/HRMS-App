import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ParticleBackground from '../components/3d/ParticleBackground';
import { ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

const ROLES = [
  { value: 'hr_admin', label: 'HR Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
];

export default function Register() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'employee' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Full name is required'); return; }
    if (!form.email.trim()) { setError('Email is required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.');
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

        <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20, maxWidth: 520 }}>
          Join{' '}
          <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            EasySoftecH HR
          </span>
          {' '}Today
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
          Create your account and get instant access to the full HR suite — payroll, attendance, leave management, recruitment, and more.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
          {[
            { icon: '🔒', title: 'Secure by default', desc: 'All data is encrypted and role-gated with JWT authentication.' },
            { icon: '⚡', title: 'Instant access', desc: 'Get up and running in seconds — no lengthy onboarding needed.' },
            { icon: '🎯', title: 'Role-based experience', desc: 'HR Admin, Manager, and Employee views tailored to each role.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div style={{
        flex: '0 0 440px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={18} color="white" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>Create account</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Fill in the details below to get started</p>

          <form onSubmit={handleRegister}>
            {/* Full name */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Priya Patel"
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
            </div>

            {/* Role */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={form.role}
                onChange={set('role')}
                style={{ cursor: 'pointer' }}
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Password</label>
              <div className="search-input-wrapper">
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  style={{ paddingRight: 40 }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="form-group" style={{ marginBottom: 22 }}>
              <label className="form-label">Confirm Password</label>
              <div className="search-input-wrapper">
                <input
                  className="form-input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  style={{ paddingRight: 40 }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
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
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 22 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
