import React from 'react';
import { MODEL_LIMITS } from '../lib/modelData';

const LIMIT_ROWS = [
  { key: 'rpm', label: 'Requests / min' },
  { key: 'tpm', label: 'Tokens / min' },
  { key: 'ctx', label: 'Context window' },
  { key: 'out', label: 'Max output' },
];

export default function ModelLimits({ provider, model }) {
  const limits = MODEL_LIMITS[model];

  return (
    <div className="border border-zinc-800 p-4 h-full" data-testid="limits-table">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Model Limits</p>
        {limits && (
          <span className="text-xs font-mono text-zinc-600">From docs ({limits.tier})</span>
        )}
      </div>

      {limits ? (
        <table className="w-full border-collapse">
          <tbody>
            {LIMIT_ROWS.map(({ key, label }, i) => (
              <tr
                key={key}
                className="border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors"
              >
                <td className="py-3 text-sm font-sans text-zinc-400">{label}</td>
                <td className="py-3 text-sm font-mono text-zinc-100 text-right tabular-nums">
                  {limits[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm font-mono text-zinc-600">No data for this model</p>
          <p className="text-xs font-sans text-zinc-700 mt-1">Select a model above</p>
        </div>
      )}

      {/* Visual bar gauges */}
      {limits && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
          <p className="text-xs font-mono tracking-[0.15em] text-zinc-600 uppercase mb-2">Capacity Visual</p>
          {[
            { label: 'RPM', raw: limits.rpm, max: '4,000' },
            { label: 'Context', raw: limits.ctx, max: '2M' },
          ].map(item => {
            const parseVal = (s) => {
              if (!s) return 0;
              const str = String(s).replace(/,/g, '');
              if (str.endsWith('M')) return parseFloat(str) * 1000000;
              if (str.endsWith('K')) return parseFloat(str) * 1000;
              return parseFloat(str) || 0;
            };
            const pct = Math.min(100, (parseVal(item.raw) / parseVal(item.max)) * 100);
            return (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-mono text-zinc-500">{item.label}</span>
                  <span className="text-xs font-mono text-zinc-400">{item.raw}</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-none overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: '#22c55e' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
