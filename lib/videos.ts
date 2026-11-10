import { Platform } from 'react-native';

// Latest videos from the station's YouTube channel, shared by Home and the Video screen.
//
// Uses the YouTube Data API v3 when EXPO_PUBLIC_YOUTUBE_API_KEY is set (in .env.local for
// development, in EAS environment variables for builds). Falls back to the public RSS feed.
// Quota: each load costs 2 units (playlistItems + videos), out of 10,000 per day.

const CHANNEL_ID = 'UCuAnKqEQtc7v1-uvXhLmhyg';
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2); // a channel's uploads playlist is "UU" + its id
const API = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

// When the key is restricted to the Android app in Google Cloud, Google checks these headers.
// EXPO_PUBLIC_ANDROID_CERT_SHA1 is the signing certificate's SHA-1 (no colons), set per build
// profile: the EAS keystore for preview APKs, the Play app-signing key for store builds.
const ANDROID_PACKAGE = 'com.digitaltvtz.app';
const ANDROID_CERT_SHA1 = process.env.EXPO_PUBLIC_ANDROID_CERT_SHA1?.replace(/:/g, '').toUpperCase();
const API_HEADERS: Record<string, string> =
  Platform.OS === 'android' && ANDROID_CERT_SHA1
    ? { 'X-Android-Package': ANDROID_PACKAGE, 'X-Android-Cert': ANDROID_CERT_SHA1 }
    : {};
const YOUTUBE_RSS_JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
  `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
)}`;

export interface YouTubeVideo {
  id: string;
  title: string;
  /** Short date, e.g. "7 Nov" */
  pubDate: string;
  thumbnail: string;
  link: string;
  author: string;
  /** ISO time, when known */
  publishedAt?: string;
  /** "1:57" or "1:02:10"; missing for live streams */
  duration?: string;
  views?: number;
  /** Live now or scheduled */
  live?: 'live' | 'upcoming';
}

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'O6c5hZIrZ54',
    title: 'AZIZ KI ATOA NENO KWA MARA YA KWANZA',
    pubDate: '16 Aug',
    thumbnail: 'https://i4.ytimg.com/vi/O6c5hZIrZ54/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=O6c5hZIrZ54',
    author: 'Digitaltvtz',
  },
  {
    id: '-gMRMTBLAKg',
    title: 'KMC LEO PALITAPIKA FULL HOUSE',
    pubDate: '15 Aug',
    thumbnail: 'https://i2.ytimg.com/vi/-gMRMTBLAKg/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=-gMRMTBLAKg',
    author: 'Digitaltvtz',
  },
  {
    id: 'sgyopy4apME',
    title: 'YANGA WANAMTAMBULISHA AZIZ KI HAPA KMC',
    pubDate: '15 Aug',
    thumbnail: 'https://i4.ytimg.com/vi/sgyopy4apME/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=sgyopy4apME',
    author: 'Digitaltvtz',
  },
];

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/** "PT1H2M10S" -> "1:02:10", "PT1M57S" -> "1:57" */
export function formatDuration(iso?: string): string | undefined {
  const m = iso?.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  const [, d = '0', h = '0', min = '0', s = '0'] = m;
  const hours = Number(d) * 24 + Number(h);
  const total = hours * 3600 + Number(min) * 60 + Number(s);
  if (total === 0) return undefined; // live streams report P0D
  const mm = String(Number(min)).padStart(hours ? 2 : 1, '0');
  const ss = String(Number(s)).padStart(2, '0');
  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** 992 -> "992 views", 1786 -> "1.8K views", 1363907 -> "1.4M views" */
export function formatViews(n?: number): string | undefined {
  if (n == null) return undefined;
  if (n < 1000) return `${n} ${n === 1 ? 'view' : 'views'}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '')}K views`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M views`;
}

async function fromApi(max: number): Promise<YouTubeVideo[]> {
  const list = await fetch(
    `${API}/playlistItems?part=contentDetails&maxResults=${max}&playlistId=${UPLOADS_PLAYLIST}&key=${API_KEY}`,
    { headers: API_HEADERS },
  );
  if (!list.ok) throw new Error(`YouTube API ${list.status}`);
  const ids: string[] = ((await list.json()).items ?? []).map((i: any) => i.contentDetails?.videoId).filter(Boolean);
  if (ids.length === 0) throw new Error('No uploads');

  const res = await fetch(
    `${API}/videos?part=snippet,contentDetails,statistics&id=${ids.join(',')}&key=${API_KEY}`,
    { headers: API_HEADERS },
  );
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  const byId = new Map<string, any>(((await res.json()).items ?? []).map((v: any) => [v.id, v]));

  // Keep the uploads order (newest first); skip private or deleted videos
  return ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((v: any) => {
      const s = v.snippet;
      const t = s.thumbnails ?? {};
      const live = s.liveBroadcastContent === 'live' || s.liveBroadcastContent === 'upcoming' ? s.liveBroadcastContent : undefined;
      return {
        id: v.id,
        title: s.title,
        pubDate: shortDate(s.publishedAt),
        publishedAt: s.publishedAt,
        thumbnail: (t.maxres ?? t.standard ?? t.high ?? t.medium ?? t.default)?.url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        link: `https://www.youtube.com/watch?v=${v.id}`,
        author: s.channelTitle ?? 'Digitaltvtz',
        duration: live ? undefined : formatDuration(v.contentDetails?.duration),
        views: v.statistics?.viewCount != null ? Number(v.statistics.viewCount) : undefined,
        live,
      } as YouTubeVideo;
    });
}

function extractVideoId(guidOrLink: string): string {
  if (!guidOrLink) return '';
  const match = guidOrLink.match(/(?:v=|yt:video:|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : guidOrLink;
}

async function fromRss(): Promise<YouTubeVideo[]> {
  const res = await fetch(YOUTUBE_RSS_JSON);
  if (!res.ok) throw new Error('Could not load videos');
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Video feed is empty');
  }
  return data.items.map((item: any) => {
    const vId = extractVideoId(item.guid || item.link);
    return {
      id: vId,
      title: item.title || 'Video',
      pubDate: item.pubDate ? shortDate(item.pubDate.replace(' ', 'T') + 'Z') : 'Recent',
      publishedAt: item.pubDate ? item.pubDate.replace(' ', 'T') + 'Z' : undefined,
      thumbnail: item.thumbnail || item.enclosure?.thumbnail || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
      link: item.link || `https://www.youtube.com/watch?v=${vId}`,
      author: item.author || 'Digitaltvtz',
    };
  });
}

let cached: { at: number; videos: YouTubeVideo[] } | null = null;
const FRESH_MS = 5 * 60_000;

/** Latest channel videos. Reuses a result from the last 5 minutes unless `force` is set. */
export async function fetchLatestVideos(force = false): Promise<YouTubeVideo[]> {
  if (!force && cached && Date.now() - cached.at < FRESH_MS) return cached.videos;
  let videos: YouTubeVideo[];
  if (API_KEY) {
    try {
      videos = await fromApi(15);
    } catch (e) {
      console.warn('YouTube API failed, using RSS feed:', e);
      videos = await fromRss();
    }
  } else {
    videos = await fromRss();
  }
  cached = { at: Date.now(), videos };
  return videos;
}
