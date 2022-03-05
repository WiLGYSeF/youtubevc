import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubeInfo from 'components/YouTubePlayer/YouTubeInfo';
import YouTubePlayerController from 'components/YouTubePlayer/YouTubePlayerController';

import styles from './YouTubePlayerContainer.module.scss';

export const SEARCHPARAM_VIDEO_ID = 'v';
export const SEARCHPARAM_ENTRIES = 'entries';
export const SEARCHPARAM_LOOP_SHUFFLE = 'loopShuffle';
export const SEARCHPARAM_SHUFFLE_WEIGHT = 'shuffleWeight';

function YouTubePlayerContainer() {
  const [ytPlayer, setYtPlayer] = useState<YouTubePlayer>();

  const [searchParams] = useSearchParams();

  const videoId = searchParams.get(SEARCHPARAM_VIDEO_ID);
  const entries = searchParams.get(SEARCHPARAM_ENTRIES);
  const loopShuffle = searchParams.get(SEARCHPARAM_LOOP_SHUFFLE);
  const shuffleWeight = searchParams.get(SEARCHPARAM_SHUFFLE_WEIGHT);

  const opts: Options = {
    playerVars: {
      modestbranding: 1,
    },
  };

  const defaultVideoId = '_BSSJi-sHh8';

  return (
    <div>
      <div className={styles['yt-player']}>
        <div className="video-container">
          <YouTube
            opts={opts}
            videoId={videoId ?? defaultVideoId}
            onReady={(e: { target: YouTubePlayer }) => {
              setYtPlayer(e.target);
            }}
          />
          <YouTubeInfo ytPlayer={ytPlayer} />
        </div>
      </div>
      <YouTubePlayerController
        ytPlayer={ytPlayer}
        entries={entries}
        loopShuffle={Number(loopShuffle) > 0}
        shuffleWeight={Number(shuffleWeight) > 0}
      />
    </div>
  );
}

export default YouTubePlayerContainer;
