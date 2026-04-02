import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { getZone, isWeekendDay } from '../lib/zoneLogic';
import { ZONE_CONFIG } from '../lib/modelData';

const HOUR_LABELS = [
  '12a','1a','2a','3a','4a','5a','6a','7a','8a','9a','10a','11a',
  '12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p',
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { zone, label } = payload[0].payload;
  const config = ZONE_CONFIG[zone];
  return (
    <div
      style={{
        background: '#050505',
        border: `1px solid ${config.color}`,
        padding: '8px 12px',
        fontFamily: 'Space Mono, monospace',
      }}
    >
      <p style={{ color: config.color, fontSize: 12, margin: 0 }}>{config.label}</p>
      <p style={{ color: '#71717a', fontSize: 11, margin: '2px 0 0 0' }}>{label}</p>
    </div>
  );
}

export default function HourChart({ etDate }) {
  const currentHour = etDate.getHours();
  const dayOfWeek = etDate.getDay();
  const isWeekend = isWeekendDay(dayOfWeek);

  const data = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => {
      const zone = getZone(hour, isWeekend);
      return {
        hour,
        label: HOUR_LABELS[hour],
        zone,
        value: ZONE_CONFIG[zone].score,
        isCurrent: hour === currentHour,
      };
    });
  }, [currentHour, isWeekend]);

  return (
    <div className="border border-zinc-800 p-4" data-testid="24h-chart">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">
          24-Hour Zone View (ET) — Today
        </p>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 inline-block" style={{ background: '#22c55e' }} />
            <span className="text-zinc-500">Off-peak</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 inline-block" style={{ background: '#f59e0b' }} />
            <span className="text-zinc-500">Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 inline-block" style={{ background: '#ef4444' }} />
            <span className="text-zinc-500">Peak</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barCategoryGap="12%">
          <CartesianGrid vertical={false} stroke="#27272a" strokeDasharray="3 0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#52525b', fontFamily: 'Space Mono, monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#27272a' }}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 9, fill: '#52525b', fontFamily: 'Space Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            ticks={[20, 55, 90]}
            tickFormatter={(v) => v === 20 ? 'LOW' : v === 55 ? 'MED' : 'HIGH'}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine
            x={HOUR_LABELS[currentHour]}
            stroke="#ffffff"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.3}
          />
          <Bar dataKey="value" radius={[1, 1, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.hour}`}
                fill={ZONE_CONFIG[entry.zone].color}
                opacity={entry.isCurrent ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
