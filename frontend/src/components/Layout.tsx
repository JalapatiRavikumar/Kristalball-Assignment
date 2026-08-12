
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ArrowRightLeft, ShieldAlert, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS: Record<string, string> = {
  Admin: '#818cf8',
  Commander: '#34d399',
  Logistics: '#fbbf24',
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Purchases', path: '/purchases', icon: ShoppingCart },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
    { name: 'Assignments', path: '/assignments', icon: ShieldAlert },
  ];

  const roleColor = ROLE_COLORS[user?.role || 'Admin'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-foreground)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', borderRight: '1px solid var(--color-border)', background: 'var(--color-card)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>Kristallball</h1>
            <p style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', margin: 0, marginTop: '2px' }}>Asset Management</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                  borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                  transition: 'all 0.15s',
                  background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: isActive ? '#818cf8' : 'var(--color-muted-foreground)',
                  borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ padding: '10px 12px', marginBottom: '8px', background: `${roleColor}12`, borderRadius: '8px', fontSize: '12px', border: `1px solid ${roleColor}25` }}>
            <div style={{ color: 'var(--color-muted-foreground)' }}>Logged in as</div>
            <div style={{ fontWeight: 600, color: roleColor, marginTop: '2px' }}>{user?.username}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ color: 'var(--color-muted-foreground)', fontSize: '11px' }}>{user?.base}</span>
              <span style={{ background: `${roleColor}20`, color: roleColor, borderRadius: '20px', padding: '1px 8px', fontSize: '10px', fontWeight: 700 }}>{user?.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', width: '100%', gap: '10px', padding: '9px 12px',
              borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#f87171',
              background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '60px', borderBottom: '1px solid var(--color-border)',
          background: 'rgba(15,15,23,0.8)', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-muted-foreground)' }}>
            Military Asset Management System — <span style={{ color: roleColor, fontWeight: 600 }}>{user?.role} Dashboard</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', background: 'rgba(99,102,241,0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.2)' }}>
            🟢 System Online
          </div>
        </header>
        <div style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
