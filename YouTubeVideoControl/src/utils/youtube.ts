import { YouTubePlayer360 } from 'objects/YtpcEntry/Ytpc360Entry';

export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function getVideoIdByUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch {
    return null;
  }
}

export function playerHas360Video(player: YouTubePlayer360): boolean {
  return Object.keys(player.getSphericalProperties()).length > 0;
}
