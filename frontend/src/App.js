import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import ModelSelector from './components/ModelSelector';
import ZoneHero from './components/ZoneHero';
import MetricCards from './components/MetricCards';
import HourChart from './components/HourChart';
import WeekHeatmap from './components/WeekHeatmap';
import ModelLimits from './components/ModelLimits';
import { getETDate, getNextTransition, getZoneForDate } from './lib/zoneLogic';
import {
  DEFAULT_MODEL_BY_PROVIDER,
  MODELS,
  ZONE_CONFIG,
  getModelDetails,
  getTrafficProfileForModel,
} from './lib/modelData';
import './App.css';

export default function App() {
  const [provider, setProvider] = useState('claude');
  const [model, setModel] = useState(DEFAULT_MODEL_BY_PROVIDER.claude);
  const [etDate, setEtDate] = useState(getETDate());
  const [zone, setZone] = useState(() => getZoneForDate(getETDate(), DEFAULT_MODEL_BY_PROVIDER.claude));
  const [transition, setTransition] = useState(() => getNextTransition(getETDate(), DEFAULT_MODEL_BY_PROVIDER.claude));
  const prevZoneRef = useRef(zone);

  const modelMeta = useMemo(() => getModelDetails(model), [model]);
  const trafficProfile = useMemo(() => getTrafficProfileForModel(model), [model]);

  useEffect(() => {
    const now = getETDate();
    const nextZone = getZoneForDate(now, model);
    prevZoneRef.current = nextZone;
    setEtDate(now);
    setZone(nextZone);
    setTransition(getNextTransition(now, model));
  }, [model]);

  useEffect(() => {
    const tick = () => {
      const now = getETDate();
      const newZone = getZoneForDate(now, model);

      setEtDate(now);
      setTransition(getNextTransition(now, model));

      if (newZone !== prevZoneRef.current) {
        prevZoneRef.current = newZone;
        setZone(newZone);
        const cfg = ZONE_CONFIG[newZone];
        toast(`Zone changed to ${cfg.label}`, {
          description: `${modelMeta?.label || model}: ${cfg.text}`,
          style: {
            background: '#0a0a0b',
            border: `1px solid ${cfg.color}`,
            color: '#f8fafc',
            borderRadius: 0,
            fontFamily: 'Space Mono, monospace',
          },
        });
      } else {
        setZone(newZone);
      }
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [model, modelMeta]);

  const handleProviderChange = (nextProvider) => {
    setProvider(nextProvider);
    const firstModel = MODELS[nextProvider]?.[0] || DEFAULT_MODEL_BY_PROVIDER[nextProvider];
    if (firstModel) {
      setModel(firstModel);
    }
  };

  const clockStr = etDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const zoneConfig = ZONE_CONFIG[zone] || ZONE_CONFIG.offpeak;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 scanlines">
      <Toaster position="top-right" richColors={false} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
        <header className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-zinc-500">
            Token Zone Monitor
          </p>
          <div className="border border-zinc-800 px-3 py-1.5 flex items-center gap-3 shrink-0">
            <p className="text-[11px] font-mono tracking-[0.18em] uppercase text-zinc-600">ET</p>
            <p className="text-lg font-mono font-bold text-zinc-50 tabular-nums leading-none whitespace-nowrap">
              {clockStr}
            </p>
          </div>
        </header>

        <ModelSelector
          provider={provider}
          model={model}
          onProviderChange={handleProviderChange}
          onModelChange={setModel}
        />

        <div
          className="border px-5 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 fade-in-up"
          style={{
            borderColor: zoneConfig.border,
            background: `linear-gradient(90deg, ${zoneConfig.bgGlow} 0%, transparent 60%)`,
          }}
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="text-xs font-mono tracking-[0.22em] uppercase px-2 py-0.5"
                style={{
                  color: zoneConfig.color,
                  border: `1px solid ${zoneConfig.border}`,
                  background: zoneConfig.badgeBg,
                }}
              >
                {zoneConfig.label}
              </span>
              <span className="text-sm font-sans text-zinc-300">
                {modelMeta?.label}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-500">
                {trafficProfile.label}
              </span>
            </div>
            <p className="text-sm font-sans text-zinc-400">
              {zoneConfig.text} {zoneConfig.subtext}
            </p>
            <p className="text-xs font-sans text-zinc-500">
              {trafficProfile.scheduleLabel}
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-500 space-y-1">
            <p>
              → changes in ~{transition.hours}h {transition.mins}m ({transition.timeStr})
            </p>
            <p>{trafficProfile.inferenceNote}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <div className="lg:col-span-4 lg:row-span-2">
            <ZoneHero
              zone={zone}
              etDate={etDate}
              transition={transition}
              modelMeta={modelMeta}
              trafficProfile={trafficProfile}
            />
          </div>

          <div className="lg:col-span-8">
            <MetricCards
              etDate={etDate}
              zone={zone}
              transition={transition}
              modelMeta={modelMeta}
              trafficProfile={trafficProfile}
            />
          </div>

          <div className="lg:col-span-8">
            <HourChart etDate={etDate} model={model} trafficProfile={trafficProfile} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <div className="lg:col-span-7">
            <WeekHeatmap etDate={etDate} model={model} trafficProfile={trafficProfile} />
          </div>
          <div className="lg:col-span-5">
            <ModelLimits provider={provider} model={model} trafficProfile={trafficProfile} />
          </div>
        </div>

        <footer className="border-t border-zinc-800 pt-4 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-xs font-mono text-zinc-700">
            {trafficProfile.label}: {trafficProfile.scheduleLabel}
          </p>
          <p className="text-xs font-mono text-zinc-700">
            v1.1 · client-side · inferred ET traffic windows
          </p>
        </footer>
      </div>
    </div>
  );
}
