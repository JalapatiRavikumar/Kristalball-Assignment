import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Info, ArrowUpRight, ArrowDownRight, Package, ShieldCheck, Activity, TrendingUp, X } from 'lucide-react';

const baseTrendData = {
  'All Bases': [
    { name: 'Jan', balance: 10200 }, { name: 'Feb', balance: 11000 }, { name: 'Mar', balance: 10800 },
    { name: 'Apr', balance: 12400 }, { name: 'May', balance: 11900 }, { name: 'Jun', balance: 13200 }, { name: 'Jul', balance: 13650 },
  ],
  'Fort Alpha': [
    { name: 'Jan', balance: 6000 }, { name: 'Feb', balance: 6500 }, { name: 'Mar', balance: 6200 },
    { name: 'Apr', balance: 7100 }, { name: 'May', balance: 6800 }, { name: 'Jun', balance: 7500 }, { name: 'Jul', balance: 7800 },
  ],
  'Camp Bravo': [
    { name: 'Jan', balance: 4200 }, { name: 'Feb', balance: 4500 }, { name: 'Mar', balance: 4600 },
    { name: 'Apr', balance: 5300 }, { name: 'May', balance: 5100 }, { name: 'Jun', balance: 5700 }, { name: 'Jul', balance: 5850 },
  ],
};

const baseBarData = {
  'All Bases': [
    { name: 'Vehicles', purchased: 120, transferred: 30, expended: 15 },
    { name: 'Weapons', purchased: 340, transferred: 80, expended: 55 },
    { name: 'Ammo', purchased: 4040, transferred: 800, expended: 780 },
  ],
  'Fort Alpha': [
    { name: 'Vehicles', purchased: 80, transferred: 10, expended: 5 },
    { name: 'Weapons', purchased: 200, transferred: 30, expended: 25 },
    { name: 'Ammo', purchased: 2500, transferred: 300, expended: 400 },
  ],
  'Camp Bravo': [
    { name: 'Vehicles', purchased: 40, transferred: 20, expended: 10 },
    { name: 'Weapons', purchased: 140, transferred: 50, expended: 30 },
    { name: 'Ammo', purchased: 1540, transferred: 500, expended: 380 },
  ],
};

const cardStyle = (glowColor = 'rgba(99,102,241,0.08)'): React.CSSProperties => ({
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: `0 4px 24px ${glowColor}`,
  transition: 'all 0.2s',
});

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const [baseFilter, setBaseFilter] = useState('All Bases');
  const [equipFilter, setEquipFilter] = useState('All Equipment');

  const currentTrendData = baseTrendData[baseFilter as keyof typeof baseTrendData] || baseTrendData['All Bases'];
  let currentBarData = baseBarData[baseFilter as keyof typeof baseBarData] || baseBarData['All Bases'];
  
  // Filter bar chart by equipment type if a specific one is selected
  if (equipFilter !== 'All Equipment') {
    const equipName = equipFilter === 'Ammunition' ? 'Ammo' : equipFilter;
    currentBarData = currentBarData.filter(d => d.name === equipName);
  }

  // Calculate dynamic metrics based on the filtered data
  const currentTotal = currentBarData.reduce((acc, curr) => acc + curr.purchased + curr.transferred, 0) * 10;
  const currentExpended = currentBarData.reduce((acc, curr) => acc + curr.expended, 0) * 10;

  const metrics = [
    { label: 'Opening Balance', value: (currentTotal * 0.9).toLocaleString(), icon: Package, color: '#818cf8', sub: 'Initial stock count' },
    { label: 'Net Movement', value: `+${(currentTotal * 0.25).toLocaleString()}`, icon: Activity, color: '#34d399', sub: 'Click for breakdown', clickable: true },
    { label: 'Assigned', value: `-${(currentTotal * 0.1).toLocaleString()}`, icon: ShieldCheck, color: '#fbbf24', sub: 'Allocated to personnel' },
    { label: 'Expended', value: `-${currentExpended.toLocaleString()}`, icon: ArrowDownRight, color: '#f87171', sub: 'Consumed / used up' },
    { label: 'Closing Balance', value: currentTrendData[currentTrendData.length - 1].balance.toLocaleString(), icon: TrendingUp, color: '#34d399', sub: 'Current available' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>Asset Overview</h2>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: '13px', margin: '4px 0 0' }}>Real-time visibility across all bases</p>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { value: baseFilter, options: ['All Bases', 'Fort Alpha', 'Camp Bravo'], setter: setBaseFilter },
            { value: equipFilter, options: ['All Equipment', 'Vehicles', 'Weapons', 'Ammunition'], setter: setEquipFilter },
          ].map((f, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <select
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                style={{ 
                  background: 'var(--color-input)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '8px', 
                  padding: '8px 32px 8px 12px', 
                  color: 'var(--color-foreground)', 
                  fontSize: '13px', 
                  outline: 'none', 
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {f.options.map(o => <option key={o} style={{ background: '#1e1e2d', color: 'white' }}>{o}</option>)}
              </select>
              <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-muted-foreground)' }}>
                ▼
              </div>
            </div>
          ))}
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            style={{ 
              background: 'var(--color-input)', 
              border: '1px solid var(--color-border)', 
              borderRadius: '8px', 
              padding: '8px 12px', 
              color: 'var(--color-muted-foreground)', 
              fontSize: '13px', 
              outline: 'none',
              colorScheme: 'dark'
            }}
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              onClick={() => m.clickable && setShowModal(true)}
              style={{
                ...cardStyle(`${m.color}15`),
                cursor: m.clickable ? 'pointer' : 'default',
                border: m.clickable ? `1px solid ${m.color}40` : '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `${m.color}10` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>{m.label}</span>
                <Icon size={18} color={m.color} />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {m.sub} {m.clickable && <Info size={11} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
        {/* Area Chart */}
        <div style={cardStyle()}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 600 }}>Inventory Trend</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(240 5% 64.9%)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(240 5% 64.9%)', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} itemStyle={{ color: '#e5e7eb' }} />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorBal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={cardStyle()}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 600 }}>Equipment Breakdown</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentBarData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(240 5% 64.9%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: 'hsl(240 5% 64.9%)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'hsl(240 5% 64.9%)' }} />
                <Bar dataKey="purchased" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="transferred" fill="#34d399" radius={[3, 3, 0, 0]} />
                <Bar dataKey="expended" fill="#f87171" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Net Movement Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', margin: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Net Movement Breakdown</h3>
                <p style={{ color: 'var(--color-muted-foreground)', fontSize: '12px', margin: '4px 0 0' }}>Total: Purchases + Transfers In − Transfers Out</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {[
              { label: 'Purchases', sub: 'New assets acquired this period', value: '+4,500', color: '#34d399', icon: ArrowUpRight, bg: 'rgba(52,211,153,0.1)' },
              { label: 'Transfers In', sub: 'Received from other bases', value: '+200', color: '#818cf8', icon: ArrowUpRight, bg: 'rgba(129,140,248,0.1)' },
              { label: 'Transfers Out', sub: 'Sent to other bases', value: '−1,500', color: '#f87171', icon: ArrowDownRight, bg: 'rgba(248,113,113,0.1)' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--color-input)', borderRadius: '10px', border: '1px solid var(--color-border)', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>{item.sub}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              );
            })}

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '6px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>Total Net Movement</span>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#34d399' }}>+3,200</span>
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{ width: '100%', marginTop: '20px', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '11px', color: 'var(--color-foreground)', fontWeight: 500, cursor: 'pointer', fontSize: '14px', transition: 'all 0.15s' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
