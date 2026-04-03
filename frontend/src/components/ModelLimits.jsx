import React from 'react';
import { getModelDetails } from '../lib/modelData';

const LIMIT_ROWS = [
  { key: 'rpm', label: 'Requests / min' },
  { key: 'tpm', label: 'Tokens / min' },
  { key: 'ctx', label: 'Context window' },
  { key: 'out', label: 'Max output' },
  { key: 'batch', label: 'Batch / queue cap' },
];

function parseMagnitude(value) {
  if (!value) return null;

  const raw = String(value).replace(/,/g, '').trim();
  if (!/^\d+(\.\d+)?([KM])?$/.test(raw)) {
    return null;
  }

  if (raw.endsWith('M')) return parseFloat(raw) * 1000000;
  if (raw.endsWith('K')) return parseFloat(raw) * 1000;
  return parseFloat(raw);
}

function CapacityBars({ modelMeta }) {
  const bars = [
    { label: 'RPM', raw: modelMeta.limits.rpm, max: '4000' },
    { label: 'Context', raw: modelMeta.limits.ctx, max: '1048576' },
    { label: 'Batch', raw: modelMeta.limits.batch, max: '10000000' },
  ]
    .map((item) => ({
      ...item,
      value: parseMagnitude(item.raw),
      maxValue: parseMagnitude(item.max),
    }))
    .filter((item) => item.value && item.maxValue);

  if (!bars.length) return null;

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
      <p className="text-xs font-mono tracking-[0.15em] text-zinc-600 uppercase">Capacity visual</p>
      {bars.map((item) => {
        const pct = Math.min(100, (item.value / item.maxValue) * 100);
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
  );
}

export default function ModelLimits({ model, trafficProfile }) {
  const modelMeta = getModelDetails(model);

  if (!modelMeta) {
    return (
      <div className="border border-zinc-800 p-4 h-full" data-testid="limits-table">
        <div className="py-8 text-center">
          <p className="text-sm font-mono text-zinc-600">No data for this model</p>
          <p className="text-xs font-sans text-zinc-700 mt-1">Select a model above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 p-4 h-full" data-testid="limits-table">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Model facts</p>
          <h3 className="text-lg font-sans font-bold text-zinc-100 mt-2">{modelMeta.label}</h3>
          <p className="text-sm font-sans text-zinc-400 mt-2">{modelMeta.summary}</p>
        </div>
        <span className="text-xs font-mono text-zinc-600 uppercase tracking-[0.14em]">
          {modelMeta.status}
        </span>
      </div>

      <table className="w-full border-collapse">
        <tbody>
          {LIMIT_ROWS.map(({ key, label }) => (
            <tr
              key={key}
              className="border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors"
            >
              <td className="py-3 text-sm font-sans text-zinc-400">{label}</td>
              <td className="py-3 text-sm font-mono text-zinc-100 text-right tabular-nums">
                {modelMeta.limits[key] || 'See docs'}
              </td>
            </tr>
          ))}
          <tr className="border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors">
            <td className="py-3 text-sm font-sans text-zinc-400">Rate-limit tier</td>
            <td className="py-3 text-sm font-mono text-zinc-100 text-right">{modelMeta.limits.tier}</td>
          </tr>
          <tr className="border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors">
            <td className="py-3 text-sm font-sans text-zinc-400">Latest update</td>
            <td className="py-3 text-sm font-mono text-zinc-100 text-right">{modelMeta.latestUpdate}</td>
          </tr>
          <tr className="border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors">
            <td className="py-3 text-sm font-sans text-zinc-400">Knowledge cutoff</td>
            <td className="py-3 text-sm font-mono text-zinc-100 text-right">{modelMeta.knowledgeCutoff}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
        <div>
          <p className="text-xs font-mono tracking-[0.15em] text-zinc-600 uppercase">Versions</p>
          <p className="text-xs font-mono text-zinc-400 mt-2 leading-6">
            {modelMeta.versions.join(' | ')}
          </p>
        </div>

        <div>
          <p className="text-xs font-mono tracking-[0.15em] text-zinc-600 uppercase">Traffic profile</p>
          <p className="text-sm font-sans text-zinc-300 mt-2">{trafficProfile.label}</p>
          <p className="text-xs font-sans text-zinc-500 mt-1">{trafficProfile.scheduleLabel}</p>
          <p className="text-xs font-sans text-zinc-600 mt-2">{trafficProfile.inferenceNote}</p>
        </div>

        <div>
          <p className="text-xs font-mono tracking-[0.15em] text-zinc-600 uppercase">Source</p>
          <a
            href={modelMeta.source.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-zinc-300 underline decoration-zinc-700 underline-offset-4 break-all mt-2 inline-block"
          >
            {modelMeta.source.label}
          </a>
        </div>
      </div>

      <CapacityBars modelMeta={modelMeta} />
    </div>
  );
}
