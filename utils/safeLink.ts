import { Linking } from 'react-native';

const ALLOWED_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:'];

/** True for web, email and phone links; false for app intents, javascript: and anything else. */
export function isSafeExternalUrl(url?: string | null): url is string {
  if (!url) return false;
  try {
    return ALLOWED_SCHEMES.includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

/**
 * Open a link from content we don't control (articles, video pages) in the browser or the
 * matching app. Other schemes are ignored, so a crafted link can't launch arbitrary intents.
 */
export function openExternal(url?: string | null) {
  if (!isSafeExternalUrl(url)) return;
  Linking.openURL(url).catch(() => {});
}

/** YouTube video ids are 11 characters of letters, digits, "-" and "_". */
export function isYouTubeId(id?: string | null): id is string {
  return !!id && /^[A-Za-z0-9_-]{11}$/.test(id);
}

const YOUTUBE_HOSTS = ['www.youtube-nocookie.com', 'www.youtube.com', 'youtube.com', 'm.youtube.com'];

/** Requests the embedded player may load inside the WebView. */
export function isYouTubeEmbedUrl(url: string) {
  if (url === 'about:blank' || url.startsWith('about:srcdoc')) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && YOUTUBE_HOSTS.includes(u.hostname) && u.pathname.startsWith('/embed/');
  } catch {
    return false;
  }
}
