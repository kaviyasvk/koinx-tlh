import { useMemo } from 'react';
 
const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '₹0.00';
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
 
function StatCol({ label, value, color }) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ fontSize: '15px', fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
        {value}
      </span>
    </div>
  );
}
 
function GainSection({ label, profits, losses }) {
  const net = profits - losses;
  const netColor = net >= 0 ? '#34D399' : '#F87171';
  return (
    <div>
      <div style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
        marginBottom: '10px'
      }}>{label}</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        <StatCol label="Profits" value={fmt(profits)} color="#34D399" />
        <div className="stat-divider" />
        <StatCol label="Losses" value={fmt(losses)} color="#F87171" />
        <div className="stat-divider" />
        <StatCol label="Net Gains" value={fmt(net)} color={netColor} />
      </div>
    </div>
  );
}
 
export function CapitalGainsCard({ title, stcg, ltcg, isBlue, savings }) {
  const stcgNet = (stcg?.profits ?? 0) - (stcg?.losses ?? 0);
  const ltcgNet = (ltcg?.profits ?? 0) - (ltcg?.losses ?? 0);
  const realised = stcgNet + ltcgNet;
 
  return (
    <div className={isBlue ? 'blue-card' : 'glass-card'} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: isBlue ? '#3B82F6' : 'rgba(255,255,255,0.3)'
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
            {title}
          </span>
        </div>
        {isBlue && (
          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(59,130,246,0.2)', color: '#93C5FD', fontWeight: 600 }}>
            Live
          </span>
        )}
      </div>
 
      {/* Short term */}
      <GainSection label="Short-term" profits={stcg?.profits ?? 0} losses={stcg?.losses ?? 0} />
 
      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
 
      {/* Long term */}
      <GainSection label="Long-term" profits={ltcg?.profits ?? 0} losses={ltcg?.losses ?? 0} />
 
      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
 
      {/* Realised */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
          Realised Capital Gains
        </span>
        <span style={{
          fontSize: '20px', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
          color: realised >= 0 ? '#34D399' : '#F87171',
          fontFamily: "'Syne', sans-serif"
        }}>
          {realised < 0 ? '-' : ''}{fmt(Math.abs(realised))}
        </span>
      </div>
 
      {/* Savings */}
      {savings > 0 && (
        <div className="savings-glow" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🎉</span>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Tax savings unlocked</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#34D399', fontFamily: "'Syne', sans-serif" }}>
              You save {fmt(savings)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 