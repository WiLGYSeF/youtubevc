import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubePlayerController from 'components/YouTubePlayer/YouTubePlayerController';

import './YouTubePlayerContainer.scss';

function YouTubePlayerContainer() {
  const [ytPlayer, setYtPlayer] = useState<YouTubePlayer>();

  const [searchParams] = useSearchParams();

  const videoId = searchParams.get('v');
  const entries = searchParams.get('entries');
  const loopShuffle = searchParams.get('loopShuffle');
  const shuffleWeight = searchParams.get('shuffleWeight');

  const opts: Options = {
    playerVars: {
      modestbranding: 1,
    },
  };

  return (
    <div>
      <div className="yt-player">
        <YouTube
          opts={opts}
          videoId={videoId ?? '_BSSJi-sHh8'}
          onReady={(e: { target: YouTubePlayer }) => {
            setYtPlayer(e.target);
          }}
        />
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
