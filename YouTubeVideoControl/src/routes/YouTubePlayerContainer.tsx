import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubePlayerController from '../components/YouTubePlayer/YouTubePlayerController';

import '../css/style.min.css';

function YouTubePlayerContainer() {
  const [ytPlayer, setYtPlayer] = useState<YouTubePlayer>();

  const [searchParams] = useSearchParams();

  let videoId = searchParams.get('v');

  if (!videoId) {
    videoId = '_BSSJi-sHh8';
  }

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
          videoId={videoId}
          onReady={(e: { target: YouTubePlayer }) => {
            setYtPlayer(e.target);
          }}
        />
      </div>
      <YouTubePlayerController ytPlayer={ytPlayer} />
    </div>
  );
}

export default YouTubePlayerContainer;
