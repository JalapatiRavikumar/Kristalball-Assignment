import React, { useState } from 'react';
import { ShoppingCart, Plus, Search, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const cardStyle: React.CSSProperties = {
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '20px',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Delivered': { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
  'In Transit': { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
  'Pending': { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' },
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  'Delivered': CheckCircle,
  'In Transit': TrendingUp,
  'Pending': Clock,
};

export default function Purchases() {
  const { user } = useAuth();
  const { purchases, addPurchase } = useData();
  const canCreate = user?.role === 'Admin' || user?.role === 'Logistics';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item: '', category: 'Vehicles', qty: '', cost: '', base: user?.base || 'Fort Alpha', status: 'Pending' });
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = purchases.filter(p => {
    const matchSearch = p.item.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPurchase = {
      id: `PO-2024-00${purchases.length + 1}`,
      item: form.item, category: form.category,
      qty: Number(form.qty), unit: 'Unit', cost: form.cost,
      base: form.base, date: new Date().toISOString().slice(0, 10), status: form.status,
      createdBy: user?.username || 'Unknown',
    };
    addPurchase(newPurchase);
    setShowForm(false);
    setSuccessMsg(`Purchase order for "${form.item}" created successfully!`);
    setTimeout(() => setSuccessMsg(''), 3000);
    setForm({ item: '', category: 'Vehicles', qty: '', cost: '', base: user?.base || 'Fort Alpha', status: 'Pending' });
  };

  const stats = [
    { label: 'Total Orders', value: purchases.length, color: '#818cf8', icon: ShoppingCart },
    { label: 'Delivered', value: purchases.filter(p => p.status === 'Delivered').length, color: '#34d399', icon: CheckCircle },
    { label: 'In Transit', value: purchases.filter(p => p.status === 'In Transit').length, color: '#fbbf24', icon: TrendingUp },
    { label: 'Pending', value: purchases.filter(p => p.status === 'Pending').length, color: '#818cf8', icon: Clock },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={24} color="#818cf8" /> Purchases
          </h2>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: '13px', margin: '4px 0 0' }}>Asset acquisition orders and procurement tracking</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 600, borderRadius: '8px', padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> New Purchase Order
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#34d399', fontSize: '13px', fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders or items..."
            style={{ width: '100%', paddingLeft: '34px', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '9px 12px 9px 34px', color: 'var(--color-foreground)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--color-foreground)', fontSize: '13px', outline: 'none' }}>
          {['All', 'Delivered', 'In Transit', 'Pending'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Order ID', 'Item', 'Category', 'Qty', 'Cost', 'Base', 'Date', 'Status', 'Created By'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const sc = STATUS_COLORS[p.status];
                const SIcon = STATUS_ICONS[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#818cf8', fontWeight: 600, fontSize: '12px' }}>{p.id}</td>
                    <td style={{ padding: '12px', fontWeight: 500 }}>{p.item}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{p.category}</td>
                    <td style={{ padding: '12px' }}>{p.qty.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: '#34d399', fontWeight: 500 }}>{p.cost}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{p.base}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{p.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
                        <SIcon size={11} />{p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)', fontSize: '11px' }}>{p.createdBy || 'System'}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted-foreground)' }}>No purchase orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '28px', margin: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>New Purchase Order</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', fontSize: '20px' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Item Name', key: 'item', type: 'text', placeholder: 'e.g. M4A1 Rifle' },
                { label: 'Quantity', key: 'qty', type: 'number', placeholder: 'e.g. 100' },
                { label: 'Estimated Cost', key: 'cost', type: 'text', placeholder: 'e.g. $500,000' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} required
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              {[
                { label: 'Category', key: 'category', options: ['Vehicles', 'Weapons', 'Ammunition', 'Aircraft', 'Equipment'] },
                { label: 'Base', key: 'base', options: ['Fort Alpha', 'Camp Bravo', 'Global Operations HQ'] },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>{f.label}</label>
                  <select value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none' }}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ flex: 1, background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '11px', color: 'var(--color-foreground)', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 2, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 600, borderRadius: '8px', padding: '11px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
