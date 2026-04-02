import React from 'react';
import { ZONE_CONFIG } from '../lib/modelData';

const RADIUS = 76;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ZoneHero({ zone, etDate, transition }) {
  const config = ZONE_CONFIG[zone] || ZONE_CONFIG.offpeak;
  const arcLength = (config.score / 100) * CIRCUMFERENCE;

  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayName = DAYS[etDate.getDay()];
  const isWeekend = etDate.getDay() === 0 || etDate.getDay() === 6;

  const timeStr = etDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });

  return (
    <div
      className="border flex flex-col items-center justify-between h-full p-6 gap-4"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${config.bgGlow} 0%, #0a0a0b 70%)`,
        borderColor: config.border,
      }}
      data-testid="zone-hero-panel"
    >
      {/* Zone label */}
      <div className="text-center w-full">
        <p className="text-xs font-mono tracking-[0.22em] text-zinc-500 mb-2">CURRENT ZONE</p>
        <h1
          className="text-5xl lg:text-6xl font-mono font-bold tracking-widest leading-none"
          style={{
            color: config.color,
            textShadow: `0 0 40px ${config.color}55, 0 0 80px ${config.color}25`,
          }}
          data-testid="current-zone-display"
        >
          {config.label}
        </h1>
      </div>

      {/* SVG Ring */}
      <div className="relative w-52 h-52 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full overflow-visible">
          {/* Outer slow-rotating dashed ring */}
          <circle
            cx="100" cy="100" r="93"
            fill="none"
            stroke={config.color}
            strokeWidth="1"
            strokeDasharray="5 22"
            opacity="0.4"
            className="ring-spin"
          />
          {/* Second counter-rotating ring */}
          <circle
            cx="100" cy="100" r="87"
            fill="none"
            stroke={config.color}
            strokeWidth="0.5"
            strokeDasharray="2 40"
            opacity="0.2"
            className="ring-spin-reverse"
          />
          {/* Track circle */}
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#27272a" strokeWidth="5" />
          {/* Load arc */}
          <circle
            cx="100" cy="100" r={RADIUS}
            fill="none"
            stroke={config.color}
            strokeWidth="5"
            strokeDasharray={`${arcLength} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dasharray 1s ease, stroke 0.5s ease' }}
          />
          {/* Subtle inner glow */}
          <circle cx="100" cy="100" r="64" fill={config.bgGlow} />
          {/* Tick marks at transitions */}
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const x1 = 100 + 70 * Math.cos(rad);
            const y1 = 100 + 70 * Math.sin(rad);
            const x2 = 100 + 78 * Math.cos(rad);
            const y2 = 100 + 78 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3f3f46" strokeWidth="2" />;
          })}
        </svg>

        {/* Center text */}
        <div className="relative z-10 text-center px-2">
          <p
            className="text-xs font-mono tracking-[0.12em] uppercase leading-none mb-1"
            style={{ color: config.color }}
          >
            {config.demand}
          </p>
          <p className="text-xl font-mono font-bold tabular-nums text-zinc-50 leading-snug">
            {timeStr}
          </p>
          <p className="text-xs font-sans text-zinc-400 mt-1">
            {dayName}{isWeekend ? ' · WKND' : ''}
          </p>
        </div>
      </div>

      {/* Description + countdown */}
      <div className="text-center w-full space-y-1">
        <p className="text-sm font-sans text-zinc-300">{config.text}</p>
        <p className="text-xs font-sans text-zinc-500">{config.subtext}</p>
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p
            className="text-xs font-mono text-zinc-400"
            data-testid="zone-countdown"
          >
            → changes in ~{transition.hours}h {transition.mins}m
          </p>
          <p className="text-xs font-mono text-zinc-600">({transition.timeStr})</p>
        </div>
      </div>
    </div>
  );
}
