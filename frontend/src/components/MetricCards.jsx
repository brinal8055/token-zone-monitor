import React from 'react';
import { ZONE_CONFIG } from '../lib/modelData';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function ETTimeCard({ etDate, zone, trafficProfile }) {
  const config = ZONE_CONFIG[zone] || ZONE_CONFIG.offpeak;
  const timeStr = etDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
  const dayName = DAYS[etDate.getDay()];
  const isWeekend = etDate.getDay() === 0 || etDate.getDay() === 6;

  return (
    <div
      className="border border-zinc-800 p-4 flex flex-col gap-3 relative overflow-hidden"
      data-testid="et-time-card"
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-20"
        style={{ background: `radial-gradient(circle at top right, ${config.color}, transparent)` }}
      />
      <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">ET Time</p>
      <div>
        <p className="text-2xl font-mono font-bold tabular-nums text-zinc-50 leading-none">
          {timeStr}
        </p>
        <p className="text-xs font-sans text-zinc-400 mt-1">
          {dayName}{isWeekend ? ' · Weekend' : ''}
        </p>
        <p className="text-[11px] font-mono text-zinc-600 mt-2 uppercase tracking-[0.12em]">
          {trafficProfile.label}
        </p>
      </div>
      {/* Mini zone indicator bar */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full pulse-dot"
          style={{ background: config.color }}
        />
        <span className="text-xs font-mono" style={{ color: config.color }}>
          {config.demand}
        </span>
      </div>
    </div>
  );
}

function NextZoneCard({ transition }) {
  const nextZoneKey = transition.nextZone || 'offpeak';
  const config = ZONE_CONFIG[nextZoneKey] || ZONE_CONFIG.offpeak;

  return (
    <div className="border border-zinc-800 p-4 flex flex-col gap-3 relative overflow-hidden" data-testid="next-zone-card">
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-20"
        style={{ background: `radial-gradient(circle at top right, ${config.color}, transparent)` }}
      />
      <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Next Zone</p>
      <div>
        <p
          className="text-2xl font-mono font-bold leading-none"
          style={{ color: config.color }}
          data-testid="next-zone-name"
        >
          {config.label}
        </p>
        <p className="text-xs font-sans text-zinc-400 mt-1">
          in ~{transition.hours}h {transition.mins}m
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-zinc-600">at {transition.timeStr}</span>
      </div>
    </div>
  );
}

function RecommendedCard({ zone, modelMeta }) {
  const config = ZONE_CONFIG[zone] || ZONE_CONFIG.offpeak;

  return (
    <div className="border border-zinc-800 p-4 flex flex-col gap-3 relative overflow-hidden" data-testid="recommended-card">
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-20"
        style={{ background: `radial-gradient(circle at top right, ${config.color}, transparent)` }}
      />
      <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Recommended</p>
      <div>
        <p
          className="text-xl font-sans font-bold text-zinc-50 leading-snug"
          data-testid="recommendation-text"
        >
          {config.rec}
        </p>
        <p className="text-xs font-sans text-zinc-400 mt-1">{config.recSub}</p>
        <p className="text-[11px] font-mono text-zinc-600 mt-2 uppercase tracking-[0.12em]">
          {modelMeta.status}
        </p>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-none text-xs font-mono self-start"
        style={{ background: config.badgeBg, color: config.color, border: `1px solid ${config.border}` }}
      >
        {zone === 'offpeak' ? '✓ Optimal' : zone === 'moderate' ? '~ Caution' : '⚠ High Load'}
      </div>
    </div>
  );
}

export default function MetricCards({ etDate, zone, transition, modelMeta, trafficProfile }) {
  return (
    <div className="grid grid-cols-3 gap-4" data-testid="metric-cards">
      <ETTimeCard etDate={etDate} zone={zone} trafficProfile={trafficProfile} />
      <NextZoneCard transition={transition} />
      <RecommendedCard zone={zone} modelMeta={modelMeta} />
    </div>
  );
}
