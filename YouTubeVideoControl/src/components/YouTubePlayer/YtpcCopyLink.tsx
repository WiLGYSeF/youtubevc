import React from 'react';
import copy from 'copy-to-clipboard';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

interface YtpcCopyLinkProps {
  videoId: string | null,
  entries: YouTubePlayerControllerEntry[];
}

// export const BASE_URL = 'https://www.youtubevc.com';
export const BASE_URL = 'http://localhost:3000';

function getUrl(videoId: string, entries: YouTubePlayerControllerEntry[]): string {
  return `${BASE_URL}/watch?v=${videoId}&entries=${encodeURI(JSON.stringify(entries))}`;
}

function YtpcCopyLink(props: YtpcCopyLinkProps) {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (props.videoId) {
            YtpcCopyLink.prototype.copy(getUrl(props.videoId, props.entries));
          }
        }}
      >
        Copy Link
      </button>
    </div>
  );
}

// defined here to be able to mock in tests
YtpcCopyLink.prototype.copy = (str: string): void => {
  copy(str);
};

export default YtpcCopyLink;
