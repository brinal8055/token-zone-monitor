# Token Zone Monitor — PRD

## Overview
Real-time client-side web dashboard that helps developers know the optimal time to call AI model APIs (Anthropic Claude, OpenAI, Google Gemini) based on Eastern Time demand zones.

**Date:** February 2026  
**Version:** 1.0  
**Architecture:** Zero-backend core — all zone logic runs client-side

---

## User Persona
Developers and engineering teams who use AI APIs and want to optimize their workload timing for cost/performance efficiency.

---

## Core Requirements (Static)
- Zone classification: OFF-PEAK / MODERATE / PEAK based on Eastern Time business hours
- Zone logic: `getZone(etHour, isWeekend)` — purely deterministic, client-side
- Live 1-second clock in ET timezone via `Intl.DateTimeFormat`
- Provider support: Anthropic Claude, OpenAI, Google Gemini
- Model-specific rate limits (hardcoded from provider docs)

## Zone Schedule (ET)
| Zone     | Time Window |
|----------|-------------|
| OFF-PEAK | Weekdays 6 PM – 6 AM ET & all weekends |
| MODERATE | Weekdays 6–8 AM & 2–6 PM ET |
| PEAK     | Weekdays 8 AM – 2 PM ET |

---

## What's Been Implemented (Feb 2026)

### Phase 1 — Complete
- [x] `getETDate()` using Intl API (no hardcoded UTC offsets)
- [x] `getZone(hour, isWeekend)` pure function
- [x] `getNextTransition(etDate)` countdown logic
- [x] ZoneHero component — large zone panel with animated SVG ring (dual rotating rings)
- [x] MetricCards — ET Time, Next Zone, Recommended action
- [x] HourChart — Recharts BarChart for 24-hr zone view
- [x] WeekHeatmap — CSS grid 7 days × 12 time slots
- [x] ModelLimits — rate limits table + capacity visual bars
- [x] ModelSelector — Provider + Model dropdowns
- [x] Sonner toast notification on zone change
- [x] Dark terminal aesthetic (Space Mono + DM Sans fonts)
- [x] Retro-futurism / Terminal Technical design
- [x] Scanlines CSS overlay
- [x] 1-second clock tick + zone refresh
- [x] All 3 providers: Anthropic (6 models), OpenAI (6 models), Google Gemini (5 models)
- [x] Model limits for all 17 models

### Tech Stack
- Frontend: React 19 + Tailwind CSS v3
- Charts: Recharts v3
- Toast: Sonner v2
- Fonts: DM Sans (UI) + Space Mono (data) via Google Fonts
- ET Timezone: Browser Intl API (no external library)

---

## Prioritized Backlog

### P0 (Critical — should be done)
- [ ] Live Anthropic /v1/models API fetch (when user provides API key)
- [ ] Backend proxy route for API key security

### P1 (Important)
- [ ] URL persistence: `?provider=claude&model=claude-opus-4-6`
- [ ] Mobile responsive polish (single-column layout < 480px)
- [ ] Zone change history log (last 5 transitions)
- [ ] Timezone selector (currently ET only)

### P2 (Nice to have)
- [ ] Slack/email webhook alert on zone change
- [ ] Usage overlay (fetch own usage stats from provider APIs)
- [ ] Multi-timezone comparison panel
- [ ] Export zone schedule as CSV

---

## File Structure
```
frontend/src/
  lib/
    zoneLogic.js       ← getZone(), getNextTransition(), getETDate()
    modelData.js       ← PROVIDERS, MODELS, MODEL_LIMITS, ZONE_CONFIG
  components/
    ZoneHero.jsx       ← Large zone panel with animated SVG ring
    MetricCards.jsx    ← 3 metric cards (ET Time, Next Zone, Recommended)
    HourChart.jsx      ← Recharts 24-hr bar chart
    WeekHeatmap.jsx    ← CSS grid weekly heatmap (7×12)
    ModelLimits.jsx    ← Rate limits table + capacity bars
    ModelSelector.jsx  ← Provider + Model dropdowns
  App.js               ← Main state, clock interval, layout
  App.css              ← CSS animations (ring-spin, pulse-dot, fade-in)
  index.css            ← Global styles + Google Fonts import
```
