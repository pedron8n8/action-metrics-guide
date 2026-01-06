import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BENCHMARKS as DEFAULT_BENCHMARKS } from '@/lib/benchmarks';
import { KPIData } from '@/data/mockData';

// --- Types ---

export type RoleType = 'Lead Generator' | 'SMS/Marketing' | 'Closer/Acquisitions' | 'Analyst';

export const AVAILABLE_ROLES: RoleType[] = [
  'Lead Generator',
  'SMS/Marketing',
  'Closer/Acquisitions',
  'Analyst'
];

interface BenchmarkRange {
  min: number;
  max: number;
}

export interface DashboardBenchmarks {
  smsResponseRate: BenchmarkRange;
  coldCallResponseRate: BenchmarkRange;
  mailResponseRate: BenchmarkRange;
  leadToQualifiedRate: BenchmarkRange;
  qualifiedToOfferRate: BenchmarkRange;
  offerToContractRate: BenchmarkRange; // Sent
  contractSignRate: BenchmarkRange;    // Signed
}

// Initial default state transforming the simple numbers to ranges (heuristic)
const INITIAL_BENCHMARKS: DashboardBenchmarks = {
  smsResponseRate: { min: 10, max: 15 },
  coldCallResponseRate: { min: 1, max: 3 },
  mailResponseRate: { min: 1.5, max: 3 },
  leadToQualifiedRate: { min: 20, max: 35 },
  qualifiedToOfferRate: { min: 30, max: 40 }, // estimated from previous data
  offerToContractRate: { min: 15, max: 25 },
  contractSignRate: { min: 80, max: 92 },
};

// Default Roles Map
const INITIAL_ROLES: Record<string, RoleType> = {
  "Gina": "Lead Generator",
  "Alex": "Lead Generator",
  "Kyle": "Lead Generator",
  "Ian": "Lead Generator",
  "Zia": "Lead Generator",
  "Leah": "Lead Generator",
  "Pedro Dev": "SMS/Marketing",
  "Jescel": "SMS/Marketing",
  "Lana Brown": "Closer/Acquisitions",
};

interface DashboardContextType {
  benchmarks: DashboardBenchmarks;
  updateBenchmark: (key: keyof DashboardBenchmarks, field: 'min' | 'max', value: number) => void;
  
  roles: Record<string, RoleType>;
  updateRole: (name: string, role: RoleType) => void;
  
  // Helper to get role (handles aliases if we keep them, or just direct lookup)
  getRole: (name: string) => RoleType | undefined;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use default
  const [benchmarks, setBenchmarks] = useState<DashboardBenchmarks>(() => {
    const saved = localStorage.getItem('dashboard_benchmarks');
    return saved ? JSON.parse(saved) : INITIAL_BENCHMARKS;
  });

  const [roles, setRoles] = useState<Record<string, RoleType>>(() => {
    const saved = localStorage.getItem('dashboard_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  useEffect(() => {
    localStorage.setItem('dashboard_benchmarks', JSON.stringify(benchmarks));
  }, [benchmarks]);

  useEffect(() => {
    localStorage.setItem('dashboard_roles', JSON.stringify(roles));
  }, [roles]);

  const updateBenchmark = (key: keyof DashboardBenchmarks, field: 'min' | 'max', value: number) => {
    setBenchmarks(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const updateRole = (name: string, role: RoleType) => {
    setRoles(prev => ({
      ...prev,
      [name]: role
    }));
  };

  const getRole = (name: string): RoleType | undefined => {
    // Alias logic could live here if we want it global
    let normalized = name;
    if (name.includes("Leah")) normalized = "Zia"; // Assuming we map to Zia's role
    if (name.includes("Kyle")) normalized = "Alex"; // Assuming we map to Alex's role
    
    // First try normalized name, then original, then partial match
    if (roles[normalized]) return roles[normalized];
    if (roles[name]) return roles[name];
    
    // Partial match search
    const foundKey = Object.keys(roles).find(key => name.includes(key));
    return foundKey ? roles[foundKey] : undefined;
  };

  return (
    <DashboardContext.Provider value={{ benchmarks, updateBenchmark, roles, updateRole, getRole }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
