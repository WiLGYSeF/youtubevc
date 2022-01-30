import React from 'react';
import { useSearchParams } from 'react-router-dom';

import YouTube, { Options } from 'react-youtube';

import YouTubePlayerController from '../components/YouTubePlayer/YouTubePlayerController';

import '../css/style.min.css';

function YouTubePlayer() {
  const [searchParams, setSearchParams] = useSearchParams();
  let videoId = searchParams.get('v');

  if (!videoId) {
    videoId = '_BSSJi-sHh8';
  }

  const opts: Options = {
    playerVars: {
      modestbranding: 1
    }
  };

  return (
    <div>
      <YouTube opts={opts} videoId={videoId} />
      <YouTubePlayerController />
    </div>
  );
}

export default YouTubePlayer;
