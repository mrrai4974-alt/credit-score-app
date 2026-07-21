import React from 'react';

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

export const Card: React.FC<{
  title?: string;
  sub?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, sub, action, children, className }) => (
  <div className={`card ${className ?? ''}`}>
    {(title || action) && (
      <div className="card-head">
        <div>
          {title && <div className="card-title">{title}</div>}
          {sub && <div className="card-sub">{sub}</div>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

export const Badge: React.FC<{ tone?: Tone; children: React.ReactNode }> = ({
  tone = 'neutral',
  children,
}) => <span className={`badge ${tone}`}>{children}</span>;

export const StatTile: React.FC<{
  label: string;
  value: string;
  delta?: number;
  up?: boolean;
  foot?: string;
}> = ({ label, value, delta, up, foot }) => (
  <div className="stat">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {delta !== undefined && (
      <div className={`stat-delta ${up ? 'up' : 'down'}`}>
        {up ? '▲' : '▼'} {Math.abs(delta)}%
      </div>
    )}
    {foot && <div className="stat-foot">{foot}</div>}
  </div>
);

export const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  sm?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ variant = 'primary', sm, onClick, disabled, children }) => (
  <button
    className={`btn ${variant} ${sm ? 'sm' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const PillTabs: React.FC<{
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}> = ({ options, value, onChange }) => (
  <div className="pill-tab">
    {options.map((o) => (
      <button
        key={o.key}
        className={value === o.key ? 'active' : ''}
        onClick={() => onChange(o.key)}
      >
        {o.label}
      </button>
    ))}
  </div>
);
