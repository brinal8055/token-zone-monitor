import React, { useMemo, useState } from 'react';
import { getZoneForCell } from '../lib/zoneLogic';
import { ZONE_CONFIG } from '../lib/modelData';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Time slots: every 2 hours
const TIME_SLOTS = [
  { hour: 0,  label: '12a' },
  { hour: 2,  label: '2a'  },
  { hour: 4,  label: '4a'  },
  { hour: 6,  label: '6a'  },
  { hour: 8,  label: '8a'  },
  { hour: 10, label: '10a' },
  { hour: 12, label: '12p' },
  { hour: 14, label: '2p'  },
  { hour: 16, label: '4p'  },
  { hour: 18, label: '6p'  },
  { hour: 20, label: '8p'  },
  { hour: 22, label: '10p' },
];

export default function WeekHeatmap({ etDate, model, trafficProfile }) {
  const [tooltip, setTooltip] = useState(null);

  const currentDay = etDate.getDay();
  const currentHour = etDate.getHours();
  // Current slot index
  const currentSlotIdx = TIME_SLOTS.findLastIndex(s => s.hour <= currentHour);

  const grid = useMemo(() => {
    return TIME_SLOTS.map(slot =>
      DAY_LABELS.map((_, dayIdx) => {
        const zone = getZoneForCell(slot.hour, dayIdx, model);
        return { zone, config: ZONE_CONFIG[zone] };
      })
    );
  // TIME_SLOTS, DAY_LABELS, ZONE_CONFIG, getZoneForCell are module-level constants — stable references
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <div className="border border-zinc-800 p-4" data-testid="heatmap-grid">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase">Weekly Heatmap</p>
          <p className="text-[11px] font-mono text-zinc-600 mt-1 uppercase tracking-[0.12em]">
            {trafficProfile.label}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 inline-block" style={{ background: '#22c55e' }} />
            <span className="text-zinc-500">Off-peak</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 inline-block" style={{ background: '#f59e0b' }} />
            <span className="text-zinc-500">Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 inline-block" style={{ background: '#ef4444' }} />
            <span className="text-zinc-500">Peak</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 inline-block border border-white/60" style={{ background: 'transparent' }} />
            <span className="text-zinc-500">Now</span>
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 320 }}>
          {/* Day headers */}
          <div className="grid mb-1" style={{ gridTemplateColumns: '32px repeat(7, 1fr)', gap: '2px' }}>
            <div />
            {DAY_LABELS.map((d, i) => (
              <div
                key={d}
                className="text-center text-xs font-mono pb-1"
                style={{ color: i === currentDay ? '#f8fafc' : '#52525b' }}
              >
                {d}
                {i === currentDay && (
                  <div className="mx-auto mt-0.5 w-4 h-0.5" style={{ background: '#f8fafc' }} />
                )}
              </div>
            ))}
          </div>

          {/* Rows */}
          {TIME_SLOTS.map((slot, rowIdx) => (
            <div
              key={slot.label}
              className="grid"
              style={{ gridTemplateColumns: '32px repeat(7, 1fr)', gap: '2px', marginBottom: '2px' }}
            >
              {/* Time label */}
              <div className="flex items-center justify-end pr-2 h-7">
                <span className="text-xs font-mono text-zinc-600">{slot.label}</span>
              </div>
              {/* Cells */}
              {DAY_LABELS.map((dayLabel, dayIdx) => {
                const { zone, config } = grid[rowIdx][dayIdx];
                const isNow = dayIdx === currentDay && rowIdx === currentSlotIdx;
                return (
                  <div
                    key={dayLabel}
                    className="h-7 cursor-pointer relative"
                    onMouseEnter={() => setTooltip({ day: dayLabel, slot, zone, profile: trafficProfile.label })}
                    onMouseLeave={() => setTooltip(null)}
                    data-testid={isNow ? 'heatmap-now-cell' : undefined}
                    style={{
                      background: isNow ? config.color + '50' : config.color + '28',
                      border: isNow ? `1.5px solid ${config.color}` : `1px solid ${config.color}18`,
                      transition: 'all 0.2s',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="mt-2 pt-2 border-t border-zinc-800">
          <p className="text-xs font-mono text-zinc-400">
            <span style={{ color: ZONE_CONFIG[tooltip.zone].color }}>{ZONE_CONFIG[tooltip.zone].label}</span>
            {' · '}{tooltip.day} {tooltip.slot.label}
          </p>
          <p className="text-[11px] font-mono text-zinc-600 mt-1">{tooltip.profile}</p>
        </div>
      )}
    </div>
  );
}
