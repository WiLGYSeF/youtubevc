import React from 'react';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

interface YtpcCopyLinkProps {
  videoId: string | null,
  entries: YouTubePlayerControllerEntry[];
  onCopy?(url: string): boolean;
}

function getUrl(videoId: string, entries: YouTubePlayerControllerEntry[]): string {
  return `${process.env.REACT_APP_BASE_URL}/watch?v=${videoId}&entries=${encodeURI(JSON.stringify(entries))}`;
}

function YtpcCopyLink(props: YtpcCopyLinkProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => {
        if (props.videoId) {
          const url = getUrl(props.videoId, props.entries);
          if (!props.onCopy || props.onCopy(url)) {
            YtpcCopyLink.prototype.copy(url);
          }
        }
      }}
    >
      {t('copyLink.copyLink')}
    </button>
  );
}

export interface YtpcCopyLinkInputs {
  button: HTMLButtonElement;
}

export function getInputs(container: HTMLElement): YtpcCopyLinkInputs {
  return {
    button: container.querySelector('button')!,
  };
}

// defined here to be able to mock in tests
YtpcCopyLink.prototype.copy = (str: string): void => {
  copy(str);
};

export default YtpcCopyLink;
