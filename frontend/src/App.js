import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import ModelSelector from './components/ModelSelector';
import ZoneHero from './components/ZoneHero';
import MetricCards from './components/MetricCards';
import HourChart from './components/HourChart';
import WeekHeatmap from './components/WeekHeatmap';
import ModelLimits from './components/ModelLimits';
import { getETDate, getZone, getNextTransition, isWeekendDay } from './lib/zoneLogic';
import { MODELS, ZONE_CONFIG } from './lib/modelData';
import './App.css';

export default function App() {
  const [provider, setProvider] = useState('claude');
  const [model, setModel] = useState('claude-opus-4-6');
  const [etDate, setEtDate] = useState(getETDate());
  const [zone, setZone] = useState(() => {
    const d = getETDate();
    return getZone(d.getHours(), isWeekendDay(d.getDay()));
  });
  const [transition, setTransition] = useState(() => getNextTransition(getETDate()));
  const prevZoneRef = useRef(zone);

  // 1-second clock tick + zone refresh
  useEffect(() => {
    const tick = () => {
      const now = getETDate();
      setEtDate(now);
      const newZone = getZone(now.getHours(), isWeekendDay(now.getDay()));
      if (newZone !== prevZoneRef.current) {
        prevZoneRef.current = newZone;
        setZone(newZone);
        const cfg = ZONE_CONFIG[newZone];
        toast(
          `Zone changed to ${cfg.label}`,
          {
            description: cfg.text,
            style: {
              background: '#0a0a0b',
              border: `1px solid ${cfg.color}`,
              color: '#f8fafc',
              borderRadius: 0,
              fontFamily: 'Space Mono, monospace',
            },
          }
        );
      }
      setTransition(getNextTransition(now));
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleProviderChange = useCallback((p) => {
    setProvider(p);
    const firstModel = MODELS[p]?.[0];
    if (firstModel) setModel(firstModel);
  }, []);

  const clockStr = etDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });

  const zoneConfig = ZONE_CONFIG[zone] || ZONE_CONFIG.offpeak;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 scanlines">
      <Toaster position="top-right" richColors={false} />

      <div className="max-w-[1440px] mx-auto px-4 py-4 md:px-8 md:py-6 flex flex-col gap-4 md:gap-5">

        {/* ── Header ── */}
        <header className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <p className="text-xs font-mono tracking-[0.28em] text-zinc-500 uppercase">
              Token Zone Monitor
            </p>
            <p className="text-xs font-sans text-zinc-700 mt-0.5">AI API demand forecast · ET</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot flex-shrink-0" />
            <span
              className="font-mono text-sm tabular-nums text-zinc-300"
              data-testid="live-clock"
            >
              {clockStr}
            </span>
            <span className="text-xs font-mono text-zinc-600 ml-0.5">ET</span>
          </div>
        </header>

        {/* ── Controls ── */}
        <ModelSelector
          provider={provider}
          model={model}
          onProviderChange={handleProviderChange}
          onModelChange={setModel}
        />

        {/* ── Zone banner (full width above fold) ── */}
        <div
          className="border px-5 py-3 flex flex-wrap items-center justify-between gap-2 fade-in-up"
          style={{
            borderColor: zoneConfig.border,
            background: `linear-gradient(90deg, ${zoneConfig.bgGlow} 0%, transparent 60%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono tracking-[0.22em] uppercase px-2 py-0.5"
              style={{ color: zoneConfig.color, border: `1px solid ${zoneConfig.border}`, background: zoneConfig.badgeBg }}
            >
              {zoneConfig.label}
            </span>
            <span className="text-sm font-sans text-zinc-400">
              {zoneConfig.text} {zoneConfig.subtext}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            → changes in ~{transition.hours}h {transition.mins}m ({transition.timeStr})
          </span>
        </div>

        {/* ── Main grid: Hero left + Cards+Chart right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Zone Hero — left panel */}
          <div className="lg:col-span-4 lg:row-span-2">
            <ZoneHero zone={zone} etDate={etDate} transition={transition} />
          </div>

          {/* Metric Cards — right top */}
          <div className="lg:col-span-8">
            <MetricCards etDate={etDate} zone={zone} transition={transition} />
          </div>

          {/* 24-hour chart — right bottom */}
          <div className="lg:col-span-8">
            <HourChart etDate={etDate} />
          </div>
        </div>

        {/* ── Bottom row: Heatmap + Limits ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <div className="lg:col-span-7">
            <WeekHeatmap etDate={etDate} />
          </div>
          <div className="lg:col-span-5">
            <ModelLimits provider={provider} model={model} />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-800 pt-4 pb-2 flex justify-between items-center">
          <p className="text-xs font-mono text-zinc-700">
            Zone logic: ET business hours · Weekdays 8a–2p ET = PEAK
          </p>
          <p className="text-xs font-mono text-zinc-700">
            v1.0 · client-side
          </p>
        </footer>
      </div>
    </div>
  );
}
