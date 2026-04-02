// Zone logic — fully client-side, Eastern Time only

export function getETDate() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

export function isWeekendDay(day) {
  return day === 0 || day === 6; // 0=Sun, 6=Sat
}

export function getZone(etHour, isWeekend) {
  if (isWeekend) return 'offpeak';
  if (etHour >= 8 && etHour < 14) return 'peak';
  if ((etHour >= 6 && etHour < 8) || (etHour >= 14 && etHour < 18)) return 'moderate';
  return 'offpeak';
}

export function getNextTransition(etDate) {
  const hour = etDate.getHours();
  const day = etDate.getDay();
  const isWeekend = isWeekendDay(day);
  const TRANSITIONS = [6, 8, 14, 18];

  let nextHour, daysToAdd = 0;

  if (isWeekend) {
    daysToAdd = day === 0 ? 1 : 2; // Sun→Mon or Sat→Mon
    nextHour = 6;
  } else {
    nextHour = TRANSITIONS.find(h => h > hour);
    if (nextHour === undefined) {
      nextHour = 6;
      daysToAdd = day === 5 ? 3 : 1; // Fri→Mon, else next day
    }
  }

  const nextDate = new Date(etDate);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  nextDate.setHours(nextHour, 0, 0, 0);

  const diffMs = nextDate - etDate;
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;

  const ampm = nextHour >= 12 ? 'PM' : 'AM';
  const displayHour = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;
  const timeStr = `${displayHour} ${ampm} ET`;

  return { hours, mins, timeStr, nextHour };
}

export function getZoneForCell(hour, dayOfWeek) {
  return getZone(hour, isWeekendDay(dayOfWeek));
}

export function format12h(etDate) {
  return etDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    timeZone: 'America/New_York',
  });
}

export function getNextZoneName(currentZone, etDate) {
  const day = etDate.getDay();
  const hour = etDate.getHours();
  const isWeekend = isWeekendDay(day);
  if (isWeekend) return 'MODERATE';
  const TRANSITIONS = [6, 8, 14, 18];
  const nextHour = TRANSITIONS.find(h => h > hour);
  if (nextHour === undefined) return 'MODERATE';
  return getZone(nextHour, false) === 'offpeak' ? 'OFF-PEAK'
    : getZone(nextHour, false) === 'moderate' ? 'MODERATE' : 'PEAK';
}
