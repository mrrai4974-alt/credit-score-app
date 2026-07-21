import React, { useState } from 'react';

/**
 * Lightweight, dependency-free SVG charts following the dataviz method:
 * single-hue magnitude marks, thin strokes, recessive grid, hover tooltips.
 */

/* -------------------------------------------------- Horizontal bar list */

export const BarList: React.FC<{
  data: { label: string; value: number }[];
  format?: (v: number) => string;
  color?: string;
}> = ({ data, format, color }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      {data.map((d) => (
        <div className="bar-row" key={d.label}>
          <div className="bar-label" title={d.label}>
            {d.label}
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: color ?? 'var(--series-1)',
              }}
            />
          </div>
          <div className="t-num t-strong">
            {format ? format(d.value) : d.value.toLocaleString('en-IN')}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------ Area/line trend chart */

export const TrendChart: React.FC<{
  data: number[];
  labelFor?: (i: number) => string;
  valueFormat?: (v: number) => string;
  color?: string;
  height?: number;
}> = ({ data, labelFor, valueFormat, color = 'var(--series-1)', height = 200 }) => {
  const [hover, setHover] = useState<number | null>(null);
  const w = 640;
  const h = height;
  const padX = 12;
  const padY = 20;
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.85;
  const span = max - min || 1;

  const x = (i: number) => padX + (i / (data.length - 1)) * (w - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / span) * (h - padY * 2);

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1)} ${h - padY} L ${x(0)} ${h - padY} Z`;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * w;
          const i = Math.round(((rel - padX) / (w - padX * 2)) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, i)));
        }}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={w - padX}
            y1={padY + t * (h - padY * 2)}
            y2={padY + t * (h - padY * 2)}
            stroke="var(--grid)"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill="url(#areaFill)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

        {hover !== null && (
          <>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padY}
              y2={h - padY}
              stroke="var(--axis)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={x(hover)} cy={y(data[hover])} r="4.5" fill={color} stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>

      {hover !== null && (
        <div
          className="chart-tip"
          style={{ left: `${(x(hover) / w) * 100}%`, top: y(data[hover]) }}
        >
          {labelFor ? labelFor(hover) + ' · ' : ''}
          {valueFormat ? valueFormat(data[hover]) : data[hover]}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------- Radial meter */

export const Meter: React.FC<{ value: number; label: string; color?: string }> = ({
  value,
  label,
  color = 'var(--series-1)',
}) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="var(--surface-alt)" strokeWidth="9" />
        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          transform="rotate(-90 45 45)"
        />
        <text x="45" y="50" textAnchor="middle" fontSize="19" fontWeight="800" fill="var(--text)">
          {value}%
        </text>
      </svg>
      <div className="stat-foot">{label}</div>
    </div>
  );
};
