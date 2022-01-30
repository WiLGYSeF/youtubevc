import React from 'react';
import { useSearchParams } from 'react-router-dom';

import YouTube from 'react-youtube';

import '../css/style.min.css';

function YouTubePlayer() {
  const [searchParams, setSearchParams] = useSearchParams();
  let videoId = searchParams.get('v');

  if (!videoId) {
    videoId = '_BSSJi-sHh8';
  }

  return <YouTube videoId={videoId} />;
}

export default YouTubePlayer;
