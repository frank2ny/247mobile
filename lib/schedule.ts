// Sample broadcast schedule shared by Home, Radio and the Schedule screen.
// Replace with data from the CMS when it is available.

export interface ShowSchedule {
  id: string;
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  category: string;
  type: 'radio' | 'tv';
  imageUrl: string;
  isLive?: boolean;
}

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const SCHEDULE_DATA: Record<string, ShowSchedule[]> = {
  MON: [
    { id: 'm1', title: 'Asubuhi Njema Live', host: 'DJ Sky & Sarah J', startTime: '06:00', endTime: '10:00', category: 'Morning Drive', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800', isLive: true },
    { id: 'm2', title: 'Top 20 Swahili Countdown', host: 'Mike D', startTime: '10:00', endTime: '13:00', category: 'Music & Hits', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=800' },
    { id: 'm3', title: 'Digital Prime News TV', host: 'Editorial Desk', startTime: '13:00', endTime: '14:00', category: 'News Bulletin', type: 'tv', imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800' },
    { id: 'm4', title: 'Vibe la Jioni', host: 'Captain Frank', startTime: '14:00', endTime: '18:00', category: 'Afternoon Show', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1520529277867-dbf8c5e0b340?q=80&w=800' },
    { id: 'm5', title: 'Swahili Cinema Special', host: 'Video Crew', startTime: '18:00', endTime: '21:00', category: 'TV Entertainment', type: 'tv', imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800' },
  ],
  TUE: [
    { id: 't1', title: 'Asubuhi Njema Live', host: 'DJ Sky', startTime: '06:00', endTime: '10:00', category: 'Morning Drive', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800' },
    { id: 't2', title: 'Tech & Bongo Trends', host: 'Sarah J', startTime: '10:00', endTime: '14:00', category: 'Culture & Tech', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1516280440502-6c56b7c53d5a?q=80&w=800' },
    { id: 't3', title: 'Usiku wa Rhythm', host: 'DJ Flex', startTime: '18:00', endTime: '22:00', category: 'Night Session', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800' },
  ],
  WED: [
    { id: 'w1', title: 'Midday Swahili Mix', host: 'Sarah J', startTime: '10:00', endTime: '14:00', category: 'Music', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1478737270239-2fccd2cdea8a?q=80&w=800' },
    { id: 'w2', title: 'Spotlight Tanzania', host: 'Editorial Team', startTime: '15:00', endTime: '17:00', category: 'Documentary', type: 'tv', imageUrl: 'https://images.unsplash.com/photo-1505373676634-31976f08e4ba?q=80&w=800' },
  ],
  THU: [
    { id: 'th1', title: 'Asubuhi Njema Live', host: 'DJ Sky', startTime: '06:00', endTime: '10:00', category: 'Morning Drive', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800' },
  ],
  FRI: [
    { id: 'f1', title: 'Weekend Warmup', host: 'Full Crew', startTime: '16:00', endTime: '22:00', category: 'Party Mix', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800' },
  ],
  SAT: [
    { id: 'sa1', title: 'Saturday Bongo Flava', host: 'DJ Sky', startTime: '12:00', endTime: '18:00', category: 'Bongo Flava', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800' },
  ],
  SUN: [
    { id: 'su1', title: 'Sunday Gospel & Reflection', host: 'Sister Mary', startTime: '07:00', endTime: '12:00', category: 'Gospel & Inspiration', type: 'radio', imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800' },
  ],
};

export type DayKey = (typeof DAYS)[number];

/** Day key for a date, Monday-first (MON..SUN). */
export function dayKey(date = new Date()): string {
  return DAYS[(date.getDay() + 6) % 7];
}

function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Today's radio and TV shows, sorted by start time. */
export function showsForDay(day = dayKey(), type?: 'radio' | 'tv'): ShowSchedule[] {
  const list = SCHEDULE_DATA[day] ?? [];
  return [...list]
    .filter((s) => !type || s.type === type)
    .sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime));
}

export interface OnAir {
  /** Show airing now, if any */
  current?: ShowSchedule;
  /** 0..1 through the current show's slot */
  progress: number;
  /** Next show later today */
  next?: ShowSchedule;
}

/** What is on the radio now, and what comes next today. */
export function onAirNow(now = new Date()): OnAir {
  const shows = showsForDay(dayKey(now), 'radio');
  const t = now.getHours() * 60 + now.getMinutes();
  const current = shows.find((s) => minutesOf(s.startTime) <= t && t < minutesOf(s.endTime));
  const next = shows.find((s) => minutesOf(s.startTime) > t);
  const progress = current
    ? (t - minutesOf(current.startTime)) / (minutesOf(current.endTime) - minutesOf(current.startTime))
    : 0;
  return { current, next, progress: Math.min(1, Math.max(0, progress)) };
}

/** True when the show is airing at the given time today. */
export function isOnNow(show: ShowSchedule, now = new Date()) {
  const t = now.getHours() * 60 + now.getMinutes();
  return minutesOf(show.startTime) <= t && t < minutesOf(show.endTime);
}
