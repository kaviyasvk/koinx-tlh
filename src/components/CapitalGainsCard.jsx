import { fmt } from '../utils/format';
 
function GainRow({ label, profits, losses, net }) {
  const isNegNet = net < 0;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest opacity-60">{label}</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <p className="text-xs opacity-50 mb-0.5">Profits</p>
          <p className="text-sm font-semibold text-green-400">{fmt(profits)}</p>
        </div>
        <div>
          <p className="text-xs opacity-50 mb-0.5">Losses</p>
          <p className="text-sm font-semibold text-red-400">{fmt(losses)}</p>
        </div>
        <div>
          <p className="text-xs opacity-50 mb-0.5">Net Capital Gains</p>
          <p className={`text-sm font-semibold ${isNegNet ? 'text-red-400' : 'text-green-400'}`}>
            {isNegNet ? '-' : ''}{fmt(Math.abs(net))}
          </p>
        </div>
      </div>
    </div>
  );
}
 
export function CapitalGainsCard({ title, stcg, ltcg, isBlue, savings }) {
  const stcgNet = (stcg?.profits ?? 0) - (stcg?.losses ?? 0);
  const ltcgNet = (ltcg?.profits ?? 0) - (ltcg?.losses ?? 0);
  const realised = stcgNet + ltcgNet;
  const isNegRealised = realised < 0;
 
  return (
    <div className={`${isBlue ? 'card-blue' : 'card-dark'} p-5 sm:p-6 flex flex-col gap-5`}>
      <h3 className="text-sm font-semibold opacity-70 uppercase tracking-widest">{title}</h3>
 
      <GainRow label="Short-term" profits={stcg?.profits ?? 0} losses={stcg?.losses ?? 0} net={stcgNet} />
 
      <div className="h-px opacity-10 bg-white" />
 
      <GainRow label="Long-term" profits={ltcg?.profits ?? 0} losses={ltcg?.losses ?? 0} net={ltcgNet} />
 
      <div className="h-px opacity-10 bg-white" />
 
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-70">Realised Capital Gains</span>
        <span className={`text-base font-bold ${isNegRealised ? 'text-red-400' : 'text-green-400'}`}>
          {isNegRealised ? '-' : ''}{fmt(Math.abs(realised))}
        </span>
      </div>
 
      {savings > 0 && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold text-green-300 text-center"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
          🎉 You&apos;re going to save {fmt(savings)}
        </div>
      )}
    </div>
  );
}
 