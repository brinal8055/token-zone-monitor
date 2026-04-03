import {
  DEFAULT_TRAFFIC_PROFILE,
  TRAFFIC_PROFILES,
  getTrafficProfileForModel,
} from './modelData';

export function getETDate() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

export function isWeekendDay(day) {
  return day === 0 || day === 6;
}

function getProfile(modelId) {
  return getTrafficProfileForModel(modelId) || TRAFFIC_PROFILES[DEFAULT_TRAFFIC_PROFILE];
}

function getWindowsForDay(dayOfWeek, modelId) {
  const profile = getProfile(modelId);
  return isWeekendDay(dayOfWeek) ? profile.weekend : profile.weekday;
}

function zoneFromWindows(hour, windows) {
  const match = windows.find((window) => hour >= window.start && hour < window.end);
  return match?.zone || 'offpeak';
}

export function getZone(etHour, isWeekend, modelId = null) {
  const profile = getProfile(modelId);
  return zoneFromWindows(etHour, isWeekend ? profile.weekend : profile.weekday);
}

export function getZoneForDate(etDate, modelId = null) {
  return getZone(etDate.getHours(), isWeekendDay(etDate.getDay()), modelId);
}

function formatTransitionHour(nextHour) {
  const ampm = nextHour >= 12 ? 'PM' : 'AM';
  const displayHour = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;
  return `${displayHour} ${ampm} ET`;
}

export function getNextTransition(etDate, modelId = null) {
  for (let daysToAdd = 0; daysToAdd < 8; daysToAdd += 1) {
    const candidateBase = new Date(etDate);
    candidateBase.setDate(etDate.getDate() + daysToAdd);
    candidateBase.setMinutes(0, 0, 0);

    const dayOfWeek = candidateBase.getDay();
    const windows = getWindowsForDay(dayOfWeek, modelId);
    const starts = windows.map((window) => window.start);
    const boundaries = daysToAdd === 0 ? starts : [0, ...starts];
    const uniqueBoundaries = [...new Set(boundaries)];

    for (const nextHour of uniqueBoundaries) {
      if (daysToAdd === 0 && nextHour <= etDate.getHours()) {
        continue;
      }

      const nextDate = new Date(candidateBase);
      nextDate.setHours(nextHour, 0, 0, 0);

      const prevDate = new Date(nextDate.getTime() - 60000);
      const previousZone = getZoneForDate(prevDate, modelId);
      const nextZone = getZoneForDate(nextDate, modelId);

      if (previousZone === nextZone) {
        continue;
      }

      const diffMs = nextDate - etDate;
      const diffMins = Math.max(0, Math.floor(diffMs / 60000));
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;

      return {
        hours,
        mins,
        timeStr: formatTransitionHour(nextHour),
        nextHour,
        nextZone,
      };
    }
  }

  const currentZone = getZoneForDate(etDate, modelId);
  return {
    hours: 0,
    mins: 0,
    timeStr: formatTransitionHour(etDate.getHours()),
    nextHour: etDate.getHours(),
    nextZone: currentZone,
  };
}

export function getZoneForCell(hour, dayOfWeek, modelId = null) {
  return getZone(hour, isWeekendDay(dayOfWeek), modelId);
}

export function format12h(etDate) {
  return etDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    timeZone: 'America/New_York',
  });
}

export function getNextZoneName(currentZone, etDate, modelId = null) {
  return getNextTransition(etDate, modelId).nextZone || currentZone;
}
