import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { api } from '../api';
import { useAuth } from '../auth';
import { cities } from '../data/mockData';

interface NavEntry {
  to: string;
  label: string;
  icon: string;
  badgeKey?: 'unassigned' | 'disputes';
}

const SECTIONS: { title: string; items: NavEntry[] }[] = [
  { title: 'Overview', items: [{ to: '/', label: 'Dashboard', icon: '📊' }] },
  {
    title: 'Operations',
    items: [
      { to: '/orders', label: 'Orders & Dispatch', icon: '🧭', badgeKey: 'unassigned' },
      { to: '/mechanics', label: 'Mechanics', icon: '🧑‍🔧' },
      { to: '/disputes', label: 'Disputes', icon: '⚖️', badgeKey: 'disputes' },
    ],
  },
  {
    title: 'Catalog & Coverage',
    items: [
      { to: '/catalog', label: 'Service Catalog', icon: '🧰' },
      { to: '/brands', label: 'Brands & Models', icon: '🏍️' },
      { to: '/cities', label: 'Cities & Hubs', icon: '📍' },
    ],
  },
  {
    title: 'Growth',
    items: [
      { to: '/franchise', label: 'Franchise & Partners', icon: '🤝' },
      { to: '/memberships', label: 'Memberships', icon: '⭐' },
      { to: '/promotions', label: 'Promotions', icon: '🏷️' },
    ],
  },
  { title: 'Marketing', items: [{ to: '/content', label: 'Content Pages', icon: '📝' }] },
];

const TITLES: Record<string, string> = {
  '/': 'Operations Dashboard',
  '/orders': 'Orders & Dispatch',
  '/mechanics': 'Mechanic Management',
  '/disputes': 'Disputes, Refunds & Warranty',
  '/catalog': 'Service Catalog',
  '/brands': 'Brand & Model Directory',
  '/cities': 'Cities, Hubs & Serviceability',
  '/franchise': 'Franchise & Partner Leads',
  '/memberships': 'Membership Plans',
  '/promotions': 'Promotions & Coupons',
  '/content': 'Marketing Content',
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { name, logout } = useAuth();
  const [badges, setBadges] = useState<{ unassigned: number; disputes: number }>({ unassigned: 0, disputes: 0 });

  useEffect(() => {
    api
      .get<{ kpis: { unassigned: number }; openDisputes: number }>('/analytics/dashboard')
      .then((d) => setBadges({ unassigned: d.kpis.unassigned, disputes: d.openDisputes }))
      .catch(() => {});
  }, [pathname]);

  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'OP';

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">🔧</div>
          <div>
            <div className="brand-name">Doorstep Ops</div>
            <div className="brand-sub">Admin Console</div>
          </div>
        </div>

        {SECTIONS.map((sec) => (
          <div key={sec.title}>
            <div className="nav-section">{sec.title}</div>
            {sec.items.map((it) => {
              const badge = it.badgeKey ? badges[it.badgeKey] : 0;
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-ico">{it.icon}</span>
                  {it.label}
                  {badge ? <span className="nav-badge">{badge}</span> : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>{TITLES[pathname] ?? 'Doorstep Ops'}</h1>
          <div className="spacer" />
          <select className="city-select" defaultValue="All cities">
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button className="btn outline sm" onClick={logout}>Log out</button>
          <div className="avatar">{initials}</div>
        </header>
        {children}
      </div>
    </div>
  );
};
