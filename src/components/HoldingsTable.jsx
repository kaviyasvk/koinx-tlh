import { useState, useRef, useEffect } from 'react';
import { fmt, fmtQty } from '../utils/format';
 
const PAGE = 6;
 
function CoinLogo({ src, alt }) {
  const [err, setErr] = useState(false);
  const fallback = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
  return (
    <img
      src={err ? fallback : src}
      alt={alt}
      onError={() => setErr(true)}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        objectFit: 'cover', background: '#1a2640',
        border: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0
      }}
    />
  );
}
 
function GainBadge({ gain }) {
  if (Math.abs(gain) < 1e-10) return <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>—</span>;
  const pos = gain >= 0;
  return (
    <span className={pos ? 'tag-pos' : 'tag-neg'}>
      {pos ? '+' : ''}{fmt(gain)}
    </span>
  );
}
 
function HeaderChk({ all, some, onChange }) {
  const ref = useRef();
  useEffect(() => { if (ref.current) ref.current.indeterminate = some && !all; }, [all, some]);
  return <input ref={ref} type="checkbox" className="chk" checked={all} onChange={onChange} />;
}
 
const TH = ({ children, right }) => (
  <th style={{
    padding: '10px 16px', textAlign: right ? 'right' : 'left',
    fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap', fontFamily: "'Space Grotesk', sans-serif"
  }}>{children}</th>
);
 
export function HoldingsTable({ holdings, selectedIds, onToggle, onSelectAll, loading }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? holdings : holdings.slice(0, PAGE);
  const all = holdings.length > 0 && holdings.every(h => selectedIds.has(h.coin + h.coinName));
  const some = holdings.some(h => selectedIds.has(h.coin + h.coinName));
 
  return (
    <div className="glass-card fade-up-4" style={{ overflow: 'hidden' }}>
      {/* Table header */}
      <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Holdings</span>
            {!loading && <span style={{ fontSize: 12, background: 'rgba(37,99,235,0.15)', color: '#93C5FD', padding: '2px 10px', borderRadius: 99, fontWeight: 600 }}>{holdings.length} assets</span>}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Select rows to simulate harvesting</p>
        </div>
        {some && (
          <div style={{ fontSize: 13, background: 'rgba(37,99,235,0.2)', color: '#60A5FA', padding: '6px 14px', borderRadius: 10, fontWeight: 600, border: '1px solid rgba(59,130,246,0.3)' }}>
            {selectedIds.size} selected
          </div>
        )}
      </div>
 
      {/* Desktop table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '10px 12px 10px 24px', width: 40 }}>
                {!loading && <HeaderChk all={all} some={some} onChange={() => onSelectAll(!all)} />}
              </th>
              <TH>Asset</TH>
              <TH right>Holdings / Avg Buy</TH>
              <TH right>Current Price</TH>
              <TH right>Short-term Gain</TH>
              <TH right>Long-term Gain</TH>
              <TH right>Amount to Sell</TH>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array(6).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px 12px 16px 24px' }}><div className="skel" style={{ width: 18, height: 18, borderRadius: 5 }} /></td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="skel" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          <div className="skel" style={{ width: 48, height: 14 }} />
                          <div className="skel" style={{ width: 100, height: 11 }} />
                        </div>
                      </div>
                    </td>
                    {[100,70,80,90,60].map((w,j) => (
                      <td key={j} style={{ padding: '16px', textAlign: 'right' }}>
                        <div className="skel" style={{ width: w, height: 14, marginLeft: 'auto' }} />
                      </td>
                    ))}
                  </tr>
                ))
              : visible.map(h => {
                  const id = h.coin + h.coinName;
                  const sel = selectedIds.has(id);
                  return (
                    <tr key={id} className={`trow${sel ? ' selected' : ''}`} onClick={() => onToggle(id, h)}>
                      <td style={{ padding: '14px 12px 14px 24px' }} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="chk" checked={sel} onChange={() => onToggle(id, h)} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <CoinLogo src={h.logo} alt={h.coin} />
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{h.coin}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.coinName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{fmtQty(h.totalHolding)}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{fmt(h.averageBuyPrice)}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(h.currentPrice)}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}><GainBadge gain={h.stcg.gain} /></td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}><GainBadge gain={h.ltcg.gain} /></td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {sel
                          ? <span style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA', fontFamily: "'JetBrains Mono', monospace" }}>{fmtQty(h.totalHolding)}</span>
                          : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>—</span>}
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
 
      {/* View all / less */}
      {!loading && holdings.length > PAGE && (
        <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            Showing {showAll ? holdings.length : Math.min(PAGE, holdings.length)} of {holdings.length} assets
          </span>
          <button
            onClick={() => setShowAll(v => !v)}
            style={{
              fontSize: 13, fontWeight: 600, color: '#60A5FA', background: 'none',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            {showAll ? '↑ View Less' : `View All (${holdings.length}) →`}
          </button>
        </div>
      )}
    </div>
  );
}