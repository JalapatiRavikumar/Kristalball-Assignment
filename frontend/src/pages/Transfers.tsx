import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const cardStyle: React.CSSProperties = {
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '20px',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Completed': { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
  'In Transit': { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
  'Pending Approval': { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' },
};

export default function Transfers() {
  const { user } = useAuth();
  const { transfers, addTransfer } = useData();
  const canCreate = user?.role === 'Admin' || user?.role === 'Commander';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item: '', category: 'Weapons', qty: '', from: 'Fort Alpha', to: 'Camp Bravo' });
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = transfers.filter(t => {
    const matchSearch = t.item.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransfer = {
      id: `TRF-2024-00${transfers.length + 1}`,
      item: form.item, category: form.category,
      qty: Number(form.qty), from: form.from, to: form.to,
      date: new Date().toISOString().slice(0, 10), status: 'Pending Approval',
      initiator: user?.username || 'Unknown',
      createdBy: user?.username || 'Unknown',
    };
    addTransfer(newTransfer);
    setShowForm(false);
    setSuccessMsg(`Transfer request for "${form.item}" submitted for approval!`);
    setTimeout(() => setSuccessMsg(''), 3000);
    setForm({ item: '', category: 'Weapons', qty: '', from: 'Fort Alpha', to: 'Camp Bravo' });
  };

  const stats = [
    { label: 'Total Transfers', value: transfers.length, color: '#818cf8' },
    { label: 'Completed', value: transfers.filter(t => t.status === 'Completed').length, color: '#34d399' },
    { label: 'In Transit', value: transfers.filter(t => t.status === 'In Transit').length, color: '#fbbf24' },
    { label: 'Pending Approval', value: transfers.filter(t => t.status === 'Pending Approval').length, color: '#818cf8' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowRightLeft size={24} color="#34d399" /> Transfers
          </h2>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: '13px', margin: '4px 0 0' }}>Asset movements between bases and units</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            style={{ background: 'linear-gradient(135deg, #059669, #34d399)', color: 'white', fontWeight: 600, borderRadius: '8px', padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Initiate Transfer
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#34d399', fontSize: '13px', fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transfers..."
            style={{ width: '100%', paddingLeft: '34px', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '9px 12px 9px 34px', color: 'var(--color-foreground)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--color-foreground)', fontSize: '13px', outline: 'none' }}>
          {['All', 'Completed', 'In Transit', 'Pending Approval'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Transfer ID', 'Item', 'Qty', 'From → To', 'Date', 'Initiated By', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const sc = STATUS_COLORS[t.status] || { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' };
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#34d399', fontWeight: 600, fontSize: '12px' }}>{t.id}</td>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{t.item}</td>
                    <td style={{ padding: '12px' }}>{t.qty.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        <span style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '3px' }}><ArrowUpRight size={12} />{t.from}</span>
                        <span style={{ color: 'var(--color-muted-foreground)' }}>→</span>
                        <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '3px' }}><ArrowDownRight size={12} />{t.to}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{t.date}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{t.initiator}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted-foreground)' }}>No transfers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transfer Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '28px', margin: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Initiate Transfer</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', fontSize: '20px' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>Item Name</label>
                <input type="text" placeholder="e.g. M4A1 Rifles" value={form.item} required
                  onChange={e => setForm(prev => ({ ...prev, item: e.target.value }))}
                  style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>Quantity</label>
                <input type="number" placeholder="e.g. 50" value={form.qty} required
                  onChange={e => setForm(prev => ({ ...prev, qty: e.target.value }))}
                  style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[{ label: 'From Base', key: 'from' }, { label: 'To Base', key: 'to' }].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>{f.label}</label>
                    <select value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none' }}>
                      {['Fort Alpha', 'Camp Bravo', 'Global Operations HQ'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ flex: 1, background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '11px', color: 'var(--color-foreground)', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 2, background: 'linear-gradient(135deg, #059669, #34d399)', color: 'white', fontWeight: 600, borderRadius: '8px', padding: '11px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  Submit Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
