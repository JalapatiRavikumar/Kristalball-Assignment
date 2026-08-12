import React, { useState } from 'react';
import { ShieldAlert, Plus, Search, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const cardStyle: React.CSSProperties = {
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '20px',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Active': { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
  'Returned': { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' },
  'Overdue': { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  'Active': CheckCircle,
  'Returned': CheckCircle,
  'Overdue': XCircle,
};

export default function Assignments() {
  const { user } = useAuth();
  const { assignments, addAssignment } = useData();
  const canCreate = user?.role === 'Admin' || user?.role === 'Commander';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ item: '', category: 'Equipment', qty: '1', assignedTo: '', rank: 'Private', unit: '', base: user?.base || 'Fort Alpha', returnDate: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = assignments.filter(a => {
    const matchSearch = a.item.toLowerCase().includes(search.toLowerCase()) || a.assignedTo.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment = {
      id: `ASN-2024-00${assignments.length + 1}`,
      item: form.item, category: form.category,
      qty: Number(form.qty), assignedTo: form.assignedTo,
      rank: form.rank, unit: form.unit, base: form.base,
      date: new Date().toISOString().slice(0, 10), status: 'Active',
      returnDate: form.returnDate || 'N/A',
      createdBy: user?.username || 'Unknown',
    };
    addAssignment(newAssignment);
    setShowForm(false);
    setSuccessMsg(`Asset "${form.item}" successfully assigned to ${form.assignedTo}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
    setForm({ item: '', category: 'Equipment', qty: '1', assignedTo: '', rank: 'Private', unit: '', base: user?.base || 'Fort Alpha', returnDate: '' });
  };

  const stats = [
    { label: 'Total Assignments', value: assignments.length, color: '#818cf8' },
    { label: 'Active', value: assignments.filter(a => a.status === 'Active').length, color: '#34d399' },
    { label: 'Returned', value: assignments.filter(a => a.status === 'Returned').length, color: '#818cf8' },
    { label: 'Overdue', value: assignments.filter(a => a.status === 'Overdue').length, color: '#f87171' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={24} color="#fbbf24" /> Assignments
          </h2>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: '13px', margin: '4px 0 0' }}>Assets allocated to personnel and units</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: 'white', fontWeight: 600, borderRadius: '8px', padding: '10px 18px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> New Assignment
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by item or person..."
            style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '9px 12px 9px 34px', color: 'var(--color-foreground)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--color-foreground)', fontSize: '13px', outline: 'none' }}>
          {['All', 'Active', 'Returned', 'Overdue'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Assignment ID', 'Asset', 'Assigned To', 'Unit', 'Base', 'Date', 'Return Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const sc = STATUS_COLORS[a.status] || { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' };
                const SIcon = STATUS_ICONS[a.status] || Clock;
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', color: '#fbbf24', fontWeight: 600, fontSize: '12px' }}>{a.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 500 }}>{a.item}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>Qty: {a.qty}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={14} color="#fbbf24" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{a.assignedTo}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>{a.rank}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{a.unit}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{a.base}</td>
                    <td style={{ padding: '12px', color: 'var(--color-muted-foreground)' }}>{a.date}</td>
                    <td style={{ padding: '12px', color: a.returnDate === 'N/A' ? 'var(--color-muted-foreground)' : '#f87171' }}>{a.returnDate}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: sc.bg, color: sc.color, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
                        <SIcon size={11} />{a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-muted-foreground)' }}>No assignments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Assignment Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '28px', margin: '16px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>New Assignment</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', fontSize: '20px' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Asset / Item Name', key: 'item', type: 'text', placeholder: 'e.g. M4A1 Rifle' },
                { label: 'Quantity', key: 'qty', type: 'number', placeholder: '1' },
                { label: 'Assign To (Full Name)', key: 'assignedTo', type: 'text', placeholder: 'e.g. Sgt. James Wilson' },
                { label: 'Unit', key: 'unit', type: 'text', placeholder: 'e.g. 1st Infantry' },
                { label: 'Expected Return Date (optional)', key: 'returnDate', type: 'date', placeholder: '' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                    required={f.key !== 'returnDate'}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Category', key: 'category', options: ['Equipment', 'Weapons', 'Vehicles', 'Ammunition', 'Aircraft'] },
                  { label: 'Rank', key: 'rank', options: ['Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Colonel'] },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--color-muted-foreground)', marginBottom: '6px' }}>{f.label}</label>
                    <select value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'var(--color-input)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-foreground)', fontSize: '14px', outline: 'none' }}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
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
                  style={{ flex: 2, background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: 'white', fontWeight: 600, borderRadius: '8px', padding: '11px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  Assign Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
