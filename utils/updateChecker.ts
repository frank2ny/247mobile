import Constants from 'expo-constants';
import { Platform, Linking } from 'react-native';

export const CURRENT_APP_VERSION = Constants.expoConfig?.version || '1.0.6';

// Store links for 247 Digital Swahili Radio
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.digitaltvtz.app';
export const APP_STORE_URL = 'https://apps.apple.com/app/digitaltvtz/id6400000000';

export interface UpdateStatus {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  isRequired: boolean;
  releaseNotes?: string;
  storeUrl: string;
}

// Remote version endpoint (points to WordPress / API endpoint or fallback manifest)
const REMOTE_VERSION_API = 'https://247digitaltvtz.co.tz/wp/wp-json/wp/v2/posts?per_page=1&search=version_manifest';

export async function checkAppUpdate(): Promise<UpdateStatus> {
  const storeUrl = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
  
  try {
    const res = await fetch(REMOTE_VERSION_API, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].excerpt?.rendered) {
        // Parse version string from remote post excerpt or title
        const excerptText = data[0].excerpt.rendered.replace(/<[^>]*>?/gm, '').trim();
        const match = excerptText.match(/(\d+\.\d+\.\d+)/);
        if (match) {
          const remoteVer = match[1];
          const hasUpdate = isVersionHigher(remoteVer, CURRENT_APP_VERSION);
          return {
            hasUpdate,
            currentVersion: CURRENT_APP_VERSION,
            latestVersion: remoteVer,
            isRequired: excerptText.includes('FORCE_UPDATE'),
            releaseNotes: data[0].title?.rendered || 'New features and performance updates',
            storeUrl
          };
        }
      }
    }
  } catch (err) {
    console.warn('Update check fetch error, using local state check:', err);
  }

  // Default clean state
  return {
    hasUpdate: false,
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: CURRENT_APP_VERSION,
    isRequired: false,
    storeUrl
  };
}

// Utility to compare semver strings (e.g., '1.0.7' > '1.0.6')
export function isVersionHigher(v1: string, v2: string): boolean {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const n1 = p1[i] || 0;
    const n2 = p2[i] || 0;
    if (n1 > n2) return true;
    if (n1 < n2) return false;
  }
  return false;
}

export function openStoreForUpdate() {
  const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
  Linking.openURL(url).catch(err => console.error('Could not open store URL:', err));
}
