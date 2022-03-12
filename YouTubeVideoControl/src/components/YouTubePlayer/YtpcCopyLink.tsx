import React from 'react';
import { useTranslation } from 'react-i18next';
import copy from 'copy-to-clipboard';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import {
  SEARCHPARAM_ENTRIES, SEARCHPARAM_LOOP_SHUFFLE, SEARCHPARAM_SHUFFLE_WEIGHT, SEARCHPARAM_VIDEO_ID,
} from 'routes/YouTubePlayerContainer';

interface YtpcCopyLinkProps {
  videoId: string | null,
  entries: YouTubePlayerControllerEntry[];
  useLoopShuffle?: boolean;
  useLoopCountForWeights?: boolean;
  onCopy?(url: string): boolean;
}

function getUrl(
  videoId: string,
  entries: YouTubePlayerControllerEntry[],
  useLoopShuffle: boolean,
  useLoopCountForWeights: boolean,
): string {
  const params = [
    [SEARCHPARAM_VIDEO_ID, videoId],
    [SEARCHPARAM_LOOP_SHUFFLE, useLoopShuffle ? '1' : ''],
    [SEARCHPARAM_SHUFFLE_WEIGHT, useLoopCountForWeights ? '1' : ''],
    [SEARCHPARAM_ENTRIES, JSON.stringify(entries.map((e) => e.getState()))],
  ];
  const paramStr = params
    .filter(([, value]) => value.length)
    .map(([key, value]) => `${key}=${encodeURI(value)}`)
    .join('&');
  return `${process.env.REACT_APP_BASE_URL}/watch?${paramStr}`;
}

function YtpcCopyLink(props: YtpcCopyLinkProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => {
        if (props.videoId) {
          const url = getUrl(
            props.videoId,
            props.entries,
            props.useLoopShuffle ?? false,
            props.useLoopCountForWeights ?? false,
          );
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
