import React from 'react';
import copy from 'copy-to-clipboard';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

interface YtpcCopyLinkProps {
  videoId: string | null,
  entries: YouTubePlayerControllerEntry[];
}

// const BASE_URL = 'https://www.youtubevc.com';
const BASE_URL = 'http://localhost:3000';

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
            copy(getUrl(props.videoId, props.entries));
          }
        }}
      >
        Copy Link
      </button>
    </div>
  );
}

export default YtpcCopyLink;
