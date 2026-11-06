// Latest videos from the station's YouTube channel, shared by Home and the Video screen.

const CHANNEL_ID = 'UCuAnKqEQtc7v1-uvXhLmhyg';
const YOUTUBE_RSS_JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
  `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
)}`;

export interface YouTubeVideo {
  id: string;
  title: string;
  pubDate: string;
  thumbnail: string;
  link: string;
  author: string;
}

export const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'O6c5hZIrZ54',
    title: 'AZIZ KI ATOA NENO KWA MARA YA KWANZA',
    pubDate: '2026-08-16',
    thumbnail: 'https://i4.ytimg.com/vi/O6c5hZIrZ54/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=O6c5hZIrZ54',
    author: 'Digitaltvtz'
  },
  {
    id: '-gMRMTBLAKg',
    title: 'KMC LEO PALITAPIKA FULL HOUSE',
    pubDate: '2026-08-15',
    thumbnail: 'https://i2.ytimg.com/vi/-gMRMTBLAKg/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=-gMRMTBLAKg',
    author: 'Digitaltvtz'
  },
  {
    id: 'sgyopy4apME',
    title: 'YANGA WANAMTAMBULISHA AZIZ KI HAPA KMC',
    pubDate: '2026-08-15',
    thumbnail: 'https://i4.ytimg.com/vi/sgyopy4apME/hqdefault.jpg',
    link: 'https://www.youtube.com/watch?v=sgyopy4apME',
    author: 'Digitaltvtz'
  }
];

function extractVideoId(guidOrLink: string): string {
  if (!guidOrLink) return '';
  const match = guidOrLink.match(/(?:v=|yt:video:|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : guidOrLink;
}

let cached: { at: number; videos: YouTubeVideo[] } | null = null;
const FRESH_MS = 5 * 60_000;

/** Latest channel videos. Reuses a result from the last 5 minutes unless `force` is set. */
export async function fetchLatestVideos(force = false): Promise<YouTubeVideo[]> {
  if (!force && cached && Date.now() - cached.at < FRESH_MS) return cached.videos;
  const res = await fetch(YOUTUBE_RSS_JSON);
  if (!res.ok) throw new Error('Could not load videos');
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) {
    throw new Error('Video feed is empty');
  }
  const videos: YouTubeVideo[] = data.items.map((item: any) => {
    const vId = extractVideoId(item.guid || item.link);
    return {
      id: vId,
      title: item.title || 'Video',
      pubDate: item.pubDate
        ? new Date(item.pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        : 'Recent',
      thumbnail: item.thumbnail || item.enclosure?.thumbnail || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
      link: item.link || `https://www.youtube.com/watch?v=${vId}`,
      author: item.author || 'Digitaltvtz',
    };
  });
  cached = { at: Date.now(), videos };
  return videos;
}
