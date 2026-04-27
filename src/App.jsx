import { useState, useMemo, useCallback } from 'react';
import { fetchHoldings, fetchCapitalGains } from './api/mockApi';
import { useFetch } from './hooks/useFetch';
import { CapitalGainsCard } from './components/CapitalGainsCard';
import { HoldingsTable } from './components/HoldingsTable';
import { SkeletonCard } from './components/Skeleton';
 
export default function App() {
  const { data: gainsData, loading: gainsLoading } = useFetch(fetchCapitalGains);
  const { data: holdingsData, loading: holdingsLoading, error: holdingsError } = useFetch(fetchHoldings);
 
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedHoldings, setSelectedHoldings] = useState({});
 
  const handleToggle = useCallback((id, holding) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setSelectedHoldings(m => { const n = { ...m }; delete n[id]; return n; });
      } else {
        next.add(id);
        setSelectedHoldings(m => ({ ...m, [id]: holding }));
      }
      return next;
    });
  }, []);
 
  const handleSelectAll = useCallback((select) => {
    if (!holdingsData) return;
    if (select) {
      const ids = new Set(holdingsData.map(h => h.coin + h.coinName));
      const map = {};
      holdingsData.forEach(h => { map[h.coin + h.coinName] = h; });
      setSelectedIds(ids); setSelectedHoldings(map);
    } else {
      setSelectedIds(new Set()); setSelectedHoldings({});
    }
  }, [holdingsData]);
 
  const afterGains = useMemo(() => {
    if (!gainsData) return null;
    const b = gainsData.capitalGains;
    let sp = b.stcg.profits, sl = b.stcg.losses, lp = b.ltcg.profits, ll = b.ltcg.losses;
    Object.values(selectedHoldings).forEach(h => {
      const sg = h.stcg.gain, lg = h.ltcg.gain;
      if (sg > 0) sp += sg; else if (sg < 0) sl += Math.abs(sg);
      if (lg > 0) lp += lg; else if (lg < 0) ll += Math.abs(lg);
    });
    return { stcg: { profits: sp, losses: sl }, ltcg: { profits: lp, losses: ll } };
  }, [gainsData, selectedHoldings]);
 
  const savings = useMemo(() => {
    if (!gainsData || !afterGains) return 0;
    const b = gainsData.capitalGains;
    const pre = (b.stcg.profits - b.stcg.losses) + (b.ltcg.profits - b.ltcg.losses);
    const post = (afterGains.stcg.profits - afterGains.stcg.losses) + (afterGains.ltcg.profits - afterGains.ltcg.losses);
    return pre > post ? pre - post : 0;
  }, [gainsData, afterGains]);
 
  return (
    <div style={{ minHeight: '100vh', background: '#060912', position: 'relative' }}>
      <div className="orb-blue" />
      <div className="orb-purple" />
      <div className="grid-bg" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
 
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(6,9,18,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: 'white', fontFamily: "'Syne', sans-serif",
              boxShadow: '0 0 20px rgba(37,99,235,0.4)'
            }}>K</div>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>KoinX</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <nav style={{ display: 'flex', gap: 24 }}>
              {['Dashboard', 'Portfolio', 'Tax'].map(item => (
                <span key={item} style={{ fontSize: 13, fontWeight: 500, color: item === 'Tax' ? '#60A5FA' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{item}</span>
              ))}
            </nav>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Live</span>
            </div>
          </div>
        </div>
      </header>
 
      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
 
        {/* Hero */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              padding: '4px 12px', borderRadius: 99,
              background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93C5FD'
            }}>Tax Optimizer</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>FY 2024–25</div>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1.1, marginBottom: 10 }}>
            Tax Loss Harvesting
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 520, lineHeight: 1.6 }}>
            Select holdings below to simulate tax-loss harvesting. Watch your After Harvesting card update in real-time as you offset gains.
          </p>
        </div>
 
        {/* Info strip */}
        <div className="fade-up-1" style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px',
          background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)',
          borderRadius: 12, marginBottom: 32
        }}>
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
            <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Important: </strong>
            Tax-loss harvesting allows you to offset capital gains by realizing losses. 
            If gain &gt; 0, it adds to profits. If gain &lt; 0, it adds to losses. Net gains are recalculated live.
          </p>
        </div>
 
        {/* Cards grid */}
        <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
          {gainsLoading
            ? <><SkeletonCard /><SkeletonCard /></>
            : gainsData && afterGains && (<>
                <CapitalGainsCard title="Pre Harvesting" stcg={gainsData.capitalGains.stcg} ltcg={gainsData.capitalGains.ltcg} isBlue={false} />
                <CapitalGainsCard title="After Harvesting" stcg={afterGains.stcg} ltcg={afterGains.ltcg} isBlue={true} savings={savings} />
              </>)
          }
        </div>
 
        {/* Table */}
        {holdingsError
          ? (
            <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', fontSize: 14 }}>
              ⚠ Failed to load holdings — <button onClick={() => window.location.reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}>retry</button>
            </div>
          )
          : <HoldingsTable holdings={holdingsData ?? []} selectedIds={selectedIds} onToggle={handleToggle} onSelectAll={handleSelectAll} loading={holdingsLoading} />
        }
      </main>
    </div>
  );
}