import React, { createContext, useContext, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Purchase {
  id: string;
  item: string;
  category: string;
  qty: number;
  unit: string;
  cost: string;
  base: string;
  date: string;
  status: string;
  createdBy?: string;
}

export interface Transfer {
  id: string;
  item: string;
  category: string;
  qty: number;
  from: string;
  to: string;
  date: string;
  status: string;
  initiator: string;
  createdBy?: string;
}

export interface Assignment {
  id: string;
  item: string;
  category: string;
  qty: number;
  assignedTo: string;
  rank: string;
  unit: string;
  base: string;
  date: string;
  status: string;
  returnDate: string;
  createdBy?: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const INITIAL_PURCHASES: Purchase[] = [
  { id: 'PO-2024-001', item: 'M1A2 Abrams Tank', category: 'Vehicles', qty: 5, unit: 'Unit', cost: '$8,500,000', base: 'Fort Alpha', date: '2024-07-15', status: 'Delivered', createdBy: 'Admin' },
  { id: 'PO-2024-002', item: 'M4A1 Carbine Rifles', category: 'Weapons', qty: 500, unit: 'Unit', cost: '$650,000', base: 'Camp Bravo', date: '2024-07-20', status: 'In Transit', createdBy: 'Logistics' },
  { id: 'PO-2024-003', item: '5.56mm Ammunition', category: 'Ammunition', qty: 50000, unit: 'Round', cost: '$35,000', base: 'Fort Alpha', date: '2024-07-22', status: 'Pending', createdBy: 'Admin' },
  { id: 'PO-2024-004', item: 'UH-60 Black Hawk', category: 'Aircraft', qty: 2, unit: 'Unit', cost: '$21,000,000', base: 'Camp Bravo', date: '2024-07-28', status: 'Delivered', createdBy: 'Admin' },
  { id: 'PO-2024-005', item: 'Night Vision Goggles', category: 'Equipment', qty: 200, unit: 'Unit', cost: '$1,200,000', base: 'Fort Alpha', date: '2024-08-01', status: 'In Transit', createdBy: 'Logistics' },
];

const INITIAL_TRANSFERS: Transfer[] = [
  { id: 'TRF-2024-001', item: 'M4A1 Rifles', category: 'Weapons', qty: 50, from: 'Fort Alpha', to: 'Camp Bravo', date: '2024-07-10', status: 'Completed', initiator: 'Col. Martinez', createdBy: 'Commander' },
  { id: 'TRF-2024-002', item: 'HMMWV Vehicles', category: 'Vehicles', qty: 8, from: 'Camp Bravo', to: 'Fort Alpha', date: '2024-07-18', status: 'In Transit', initiator: 'Maj. Johnson', createdBy: 'Commander' },
  { id: 'TRF-2024-003', item: '7.62mm Ammo', category: 'Ammunition', qty: 10000, from: 'Fort Alpha', to: 'Camp Bravo', date: '2024-07-25', status: 'Pending Approval', initiator: 'Sgt. Williams', createdBy: 'Logistics' },
  { id: 'TRF-2024-004', item: 'Night Vision Goggles', category: 'Equipment', qty: 30, from: 'Camp Bravo', to: 'Fort Alpha', date: '2024-07-30', status: 'Completed', initiator: 'Lt. Davis', createdBy: 'Admin' },
  { id: 'TRF-2024-005', item: 'Tactical Radios', category: 'Equipment', qty: 20, from: 'Fort Alpha', to: 'Camp Bravo', date: '2024-08-02', status: 'In Transit', initiator: 'Cpt. Brown', createdBy: 'Commander' },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 'ASN-2024-001', item: 'M4A1 Rifle', category: 'Weapons', qty: 1, assignedTo: 'Sgt. James Wilson', rank: 'Sergeant', unit: '1st Infantry', base: 'Fort Alpha', date: '2024-07-05', status: 'Active', returnDate: 'N/A', createdBy: 'Commander' },
  { id: 'ASN-2024-002', item: 'Night Vision Goggles', category: 'Equipment', qty: 1, assignedTo: 'Cpl. Maria Lopez', rank: 'Corporal', unit: '2nd Recon', base: 'Camp Bravo', date: '2024-07-12', status: 'Active', returnDate: 'N/A', createdBy: 'Commander' },
  { id: 'ASN-2024-003', item: 'HMMWV Vehicle', category: 'Vehicles', qty: 1, assignedTo: 'Lt. David Chen', rank: 'Lieutenant', unit: 'HQ Company', base: 'Fort Alpha', date: '2024-07-15', status: 'Returned', returnDate: '2024-07-28', createdBy: 'Admin' },
  { id: 'ASN-2024-004', item: 'Tactical Radio', category: 'Equipment', qty: 2, assignedTo: 'Sgt. Emma Brown', rank: 'Sergeant', unit: '3rd Signal', base: 'Camp Bravo', date: '2024-07-20', status: 'Active', returnDate: 'N/A', createdBy: 'Commander' },
  { id: 'ASN-2024-005', item: 'Body Armor Set', category: 'Equipment', qty: 1, assignedTo: 'Pvt. Alex Kim', rank: 'Private', unit: '1st Infantry', base: 'Fort Alpha', date: '2024-07-25', status: 'Overdue', returnDate: '2024-08-01', createdBy: 'Admin' },
];

// ─── Helper: persist to sessionStorage ───────────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DataContextType {
  purchases: Purchase[];
  addPurchase: (p: Purchase) => void;

  transfers: Transfer[];
  addTransfer: (t: Transfer) => void;

  assignments: Assignment[];
  addAssignment: (a: Assignment) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>(() =>
    loadFromStorage('global_purchases', INITIAL_PURCHASES)
  );
  const [transfers, setTransfers] = useState<Transfer[]>(() =>
    loadFromStorage('global_transfers', INITIAL_TRANSFERS)
  );
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    loadFromStorage('global_assignments', INITIAL_ASSIGNMENTS)
  );

  const addPurchase = (p: Purchase) => {
    setPurchases(prev => {
      const next = [p, ...prev];
      saveToStorage('global_purchases', next);
      return next;
    });
  };

  const addTransfer = (t: Transfer) => {
    setTransfers(prev => {
      const next = [t, ...prev];
      saveToStorage('global_transfers', next);
      return next;
    });
  };

  const addAssignment = (a: Assignment) => {
    setAssignments(prev => {
      const next = [a, ...prev];
      saveToStorage('global_assignments', next);
      return next;
    });
  };

  return (
    <DataContext.Provider value={{ purchases, addPurchase, transfers, addTransfer, assignments, addAssignment }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
