export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="skel" style={{ height: '16px', width: '120px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skel" style={{ height: '12px', width: '80px' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          {[0,1,2].map(i => <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skel" style={{ height: '10px', width: '50px' }} />
            <div className="skel" style={{ height: '18px', width: '80px' }} />
          </div>)}
        </div>
      </div>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skel" style={{ height: '12px', width: '80px' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          {[0,1,2].map(i => <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skel" style={{ height: '10px', width: '50px' }} />
            <div className="skel" style={{ height: '18px', width: '80px' }} />
          </div>)}
        </div>
      </div>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skel" style={{ height: '14px', width: '160px' }} />
        <div className="skel" style={{ height: '24px', width: '100px' }} />
      </div>
    </div>
  );
}
 