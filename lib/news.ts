import { htmlToText } from '../utils/html';

export const NEWS_API = 'https://247digitaltvtz.co.tz/wp/wp-json/wp/v2';

// Only the fields the list needs; embeds limited to image, categories and author.
const LIST_FIELDS = 'id,date_gmt,link,title,excerpt,categories,_links,_embedded';
const LIST_EMBED = 'wp:featuredmedia,wp:term,author';

export interface NewsPost {
  id: number;
  title: string;
  excerpt: string;
  dateGmt: string;
  link: string;
  category: string;
  author?: string;
  /** ~300px image for list thumbnails */
  thumb?: string;
  /** ~768px+ image for the lead card and article hero */
  image?: string;
}

export interface NewsCategory {
  id: number;
  name: string;
}

export interface NewsPage {
  posts: NewsPost[];
  totalPages: number;
}

/** Posts seen in the list, so the article screen can show title and image instantly. */
export const postCache = new Map<number, NewsPost>();

function pickSize(media: any, names: string[]): string | undefined {
  const sizes = media?.media_details?.sizes ?? {};
  for (const n of names) {
    if (sizes[n]?.source_url) return sizes[n].source_url;
  }
  return media?.source_url || undefined;
}

export function toNewsPost(raw: any): NewsPost {
  const media = raw._embedded?.['wp:featuredmedia']?.[0];
  const hasImage = media && !media.code; // embeds return {code} objects on errors
  const post: NewsPost = {
    id: raw.id,
    title: htmlToText(raw.title?.rendered ?? ''),
    excerpt: htmlToText(raw.excerpt?.rendered ?? '').replace(/\s*\[…\]\s*$/, '…'),
    dateGmt: raw.date_gmt ?? raw.date,
    link: raw.link,
    category: capitalize(htmlToText(raw._embedded?.['wp:term']?.[0]?.[0]?.name ?? 'Habari')),
    author: raw._embedded?.author?.[0]?.name,
    thumb: hasImage ? pickSize(media, ['medium', 'digitaltvtz-card', 'medium_large', 'thumbnail']) : undefined,
    image: hasImage ? pickSize(media, ['medium_large', 'digitaltvtz-featured', 'large', 'digitaltvtz-card']) : undefined,
  };
  postCache.set(post.id, post);
  return post;
}

export async function fetchPosts(opts: {
  page?: number;
  perPage?: number;
  categoryId?: number | null;
  signal?: AbortSignal;
}): Promise<NewsPage> {
  const { page = 1, perPage = 12, categoryId, signal } = opts;
  const params = new URLSearchParams({
    _embed: LIST_EMBED,
    _fields: LIST_FIELDS,
    per_page: String(perPage),
    page: String(page),
  });
  if (categoryId) params.set('categories', String(categoryId));

  const res = await fetch(`${NEWS_API}/posts?${params.toString()}`, { signal });
  // WordPress answers 400 when asking past the last page
  if (res.status === 400 && page > 1) return { posts: [], totalPages: page - 1 };
  if (!res.ok) throw new Error('Could not load news. Check your connection and try again.');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('The news feed returned an unexpected response.');

  const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? '1') || 1;
  return { posts: data.map(toNewsPost), totalPages };
}

export async function fetchCategories(signal?: AbortSignal): Promise<NewsCategory[]> {
  const res = await fetch(`${NEWS_API}/categories?per_page=20&orderby=count&order=desc&_fields=id,name,count`, { signal });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data
    .filter((c: any) => c.count > 0 && c.name.toLowerCase() !== 'uncategorized')
    .map((c: any) => ({ id: c.id, name: capitalize(htmlToText(c.name)) }));
}

/** Full post for the article screen. */
export async function fetchPost(id: number | string) {
  const res = await fetch(`${NEWS_API}/posts/${id}?_embed=${LIST_EMBED}`);
  if (!res.ok) throw new Error('Article not found');
  const raw = await res.json();
  return { ...toNewsPost(raw), content: raw.content?.rendered as string };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseGmt(dateGmt: string) {
  return new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(dateGmt) ? dateGmt : `${dateGmt}Z`);
}

/** "Just now", "12m ago", "3h ago", "2d ago", then "16 Oct". */
export function timeAgo(dateGmt: string, now = Date.now()) {
  const d = parseGmt(dateGmt);
  const mins = Math.floor((now - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/** Reading time from article HTML, about 200 words per minute. */
export function readingMinutes(html: string) {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const PLACEHOLDER_COLORS = ['#c2410c', '#0f766e', '#1d4ed8', '#7c3aed', '#be123c', '#b45309'];

/** Stable colour per category for posts without an image. */
export function categoryColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_COLORS[h % PLACEHOLDER_COLORS.length];
}
