import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import { useAuth, type Role } from '../context/AuthContext';

const ROLES: { label: Role; color: string; description: string }[] = [
  { label: 'Admin', color: '#818cf8', description: 'Full system access' },
  { label: 'Commander', color: '#34d399', description: 'Base operations' },
  { label: 'Logistics', color: '#fbbf24', description: 'Asset management' },
];

const DEFAULTS: Record<Role, { username: string; password: string }> = {
  Admin: { username: 'admin_user', password: 'password' },
  Commander: { username: 'commander_user', password: 'password' },
  Logistics: { username: 'logistics_user', password: 'password' },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>('Admin');
  const [username, setUsername] = useState(DEFAULTS.Admin.username);
  const [password, setPassword] = useState(DEFAULTS.Admin.password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setUsername(DEFAULTS[role].username);
    setPassword(DEFAULTS[role].password);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password, selectedRole);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Try the pre-filled defaults for each role.');
      }
      setLoading(false);
    }, 600);
  };

  const roleInfo = ROLES.find(r => r.label === selectedRole)!;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-background)', padding: '16px',
      backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.07) 0%, transparent 50%)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{
          background: 'var(--color-card)', border: '1px solid var(--color-border)',
          borderRadius: '16px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top gradient bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)' }} />

          {/* Icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={32} color="#818cf8" />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Kristallball Access</h1>
            <p style={{ color: 'var(--color-muted-foreground)', fontSize: '13px', margin: '6px 0 0' }}>Military Asset Management System</p>
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-muted-foreground)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {ROLES.map(role => {
                const isSelected = selectedRole === role.label;
                return (
                  <button
                    key={role.label}
                    type="button"
                    onClick={() => handleRoleSelect(role.label)}
                    style={{
                      background: isSelected ? `${role.color}15` : 'var(--color-input)',
                      borderRadius: '8px', padding: '10px 4px', textAlign: 'center',
                      cursor: 'pointer', border: `1px solid ${isSelected ? role.color : 'var(--color-border)'}`,
                      color: isSelected ? role.color : 'var(--color-muted-foreground)',
                      transition: 'all 0.15s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      minHeight: '68px',
                      boxShadow: isSelected ? `0 0 0 1px ${role.color}` : 'none',
                      outline: 'none',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{role.label}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8, lineHeight: 1.2 }}>{role.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                style={{
                  width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)',
                  borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = roleInfo.color)}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{
                  width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)',
                  borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)',
                  fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = roleInfo.color)}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#f87171' }}>
                ⚠ {error}
              </div>
            )}

            {/* Hint box */}
            <div style={{ background: `${roleInfo.color}10`, border: `1px solid ${roleInfo.color}30`, borderRadius: '8px', padding: '10px 14px', fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
              <span style={{ color: roleInfo.color, fontWeight: 600 }}>{selectedRole}</span> credentials are pre-filled. Just click Login.
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(99,102,241,0.5)' : `linear-gradient(135deg, ${roleInfo.color}, #8b5cf6)`,
                color: 'white', fontWeight: 600, borderRadius: '8px', padding: '12px 16px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px',
                boxShadow: `0 4px 15px ${roleInfo.color}40`, transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Login as {selectedRole}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            <span>v1.0.0</span>
            <span style={{ color: '#f87171', fontWeight: 600, letterSpacing: '0.5px' }}>⚠ RESTRICTED SYSTEM</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
