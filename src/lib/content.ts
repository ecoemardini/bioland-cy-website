import { getCollection } from 'astro:content';

const TZ = 'UTC'; // dates are stored as calendar dates (YYYY-MM-DD); times are stored as local Cyprus time text
export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

// News and events share one collection; `type` is news, event or workshop.
export const TYPE_LABEL: Record<string, string> = { news: 'News', event: 'Event', workshop: 'Workshop' };
export const isEvent = (e: { data: { type: string } }) => e.data.type !== 'news';
// an event counts as past from the evening (22:00) of its last day
export const isPast = (e: { data: { date: Date; end_date?: Date } }) => (e.data.end_date ?? e.data.date).valueOf() + 22 * 3600 * 1000 < Date.now();

/** Everything (news and events), newest date first. */
export async function getNews() {
  const all = await getCollection('news', (e) => !e.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Events and workshops only, split into upcoming (soonest first) and past (latest first). */
export async function getAllEvents() {
  const all = (await getNews()).filter(isEvent).map((e) => ({ ...e, kind: TYPE_LABEL[e.data.type], past: isPast(e) }));
  const upcoming = all.filter((e) => !e.past).sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  const past = all.filter((e) => e.past);
  return { upcoming, past };
}

export async function getDeliverables() {
  const all = await getCollection('deliverables');
  const key = (c: string) => c.replace('D', '').split('.').map(Number);
  return all.sort((a, b) => { const [x1, y1] = key(a.data.code); const [x2, y2] = key(b.data.code); return x1 - x2 || y1 - y2; });
}

export const STATUS: Record<string, string> = { planned: 'Planned', 'in-progress': 'In progress', submitted: 'Submitted', published: 'Published' };

// project month (M1 = July 2026)
export const monthDate = (m: number) => {
  const d = new Date(Date.UTC(2026, 6 + m - 1, 28));
  return new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
};
export const currentMonth = () => {
  const n = new Date(); return (n.getUTCFullYear() - 2026) * 12 + (n.getUTCMonth() - 6) + 1;
};

export const WPS = [
  { id: 'WP1', title: 'Project Management', months: 'M1–M24', text: 'Governance, reporting, risk management and the Data Management Plan.' },
  { id: 'WP2', title: 'Dissemination & Communication', months: 'M1–M24', text: 'Visual identity, website, outreach, publications and exploitation.' },
  { id: 'WP3', title: 'Diet & Resource Indexing', months: 'M2–M16', text: 'Environmental baselines, integrated bioarchaeology and the Resource Accessibility Index.' },
  { id: 'WP4', title: 'Activity Modelling', months: 'M10–M20', text: 'Terrain and SAR-driven mobility and activity modelling.' },
  { id: 'WP5', title: 'Integration & BIOLAND GeoHub', months: 'M16–M24', text: 'Harmonised geodatabase and the public QGIS GeoHub.' },
];
