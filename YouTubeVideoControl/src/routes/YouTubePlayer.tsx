import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import YouTube, { Options } from 'react-youtube';

import YouTubePlayerController from '../components/YouTubePlayer/YouTubePlayerController';
import YouTubePlayerControllerEntry, { ControlType } from '../objects/YouTubePlayerControllerEntry';

import '../css/style.min.css';

function YouTubePlayer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState<any[]>([
    new YouTubePlayerControllerEntry(ControlType.Goto, 0),
    new YouTubePlayerControllerEntry(ControlType.Goto, 3),
    new YouTubePlayerControllerEntry(ControlType.Goto, 7),
    new YouTubePlayerControllerEntry(ControlType.Goto, 8),
    new YouTubePlayerControllerEntry(ControlType.Goto, 12),
    new YouTubePlayerControllerEntry(ControlType.Goto, 15),
    new YouTubePlayerControllerEntry(ControlType.Goto, 19),
    new YouTubePlayerControllerEntry(ControlType.Goto, 30),
    new YouTubePlayerControllerEntry(ControlType.Goto, 32),
  ]);

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
      <div className='yt-player'>
        <YouTube opts={opts} videoId={videoId} />
      </div>
      <YouTubePlayerController entries={entries} setEntries={(entries: any[]) => setEntries(entries)} />
    </div>
  );
}

export default YouTubePlayer;
