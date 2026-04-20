import React from 'react';
import { MODEL_DETAILS, MODELS, PROVIDERS } from '../lib/modelData';

function formatModelOption(modelId) {
  const meta = MODEL_DETAILS[modelId];
  if (!meta) return modelId;

  const suffix = meta.status === 'preview'
    ? ' (Preview)'
    : meta.status === 'deprecated'
      ? ' (Deprecated)'
      : meta.status === 'retired'
        ? ' (Retired)'
      : meta.status === 'latest'
        ? ' (Latest)'
        : '';

  return `${meta.label}${suffix}`;
}

export default function ModelSelector({ provider, model, onProviderChange, onModelChange }) {

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      {/* Provider select */}
      <div className="relative flex-1 min-w-0">
        <select
          className="w-full appearance-none bg-[#0a0a0b] border border-zinc-700 text-zinc-200
            text-sm font-sans px-3 py-2.5 pr-8 outline-none cursor-pointer
            hover:border-zinc-500 focus:border-zinc-400 transition-colors rounded-none"
          value={provider}
          onChange={e => onProviderChange(e.target.value)}
          data-testid="provider-select"
        >
          {PROVIDERS.map(p => (
            <option key={p.key} value={p.key} style={{ background: '#0a0a0b' }}>
              {p.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Model select */}
      <div className="relative flex-1 min-w-0">
        <select
          className="w-full appearance-none bg-[#0a0a0b] border border-zinc-700 text-zinc-200
            text-sm font-mono px-3 py-2.5 pr-8 outline-none cursor-pointer
            hover:border-zinc-500 focus:border-zinc-400 transition-colors rounded-none"
          value={model}
          onChange={e => onModelChange(e.target.value)}
          data-testid="model-select"
        >
          {(MODELS[provider] || []).map((modelId) => (
            <option key={modelId} value={modelId} style={{ background: '#0a0a0b' }}>
              {formatModelOption(modelId)}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Live badge */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5 border border-zinc-700 flex-shrink-0"
        data-testid="live-badge"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">live</span>
      </div>
    </div>
  );
}
