import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';

import YouTubePlayerController from '../components/YouTubePlayer/YouTubePlayerController';
import YouTubePlayerControllerEntry, { ControlType } from '../objects/YtpcEntry/YouTubePlayerControllerEntry';
import Ytpc360Entry from '../objects/YtpcEntry/Ytpc360Entry';
import YtpcGotoEntry from '../objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from '../objects/YtpcEntry/YtpcLoopEntry';
import YtpcPauseEntry from '../objects/YtpcEntry/YtpcPauseEntry';
import YtpcPlaybackRateEntry from '../objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcVolumeEntry from '../objects/YtpcEntry/YtpcVolumeEntry';

import '../css/style.min.css';

function YouTubePlayerContainer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState<YouTubePlayerControllerEntry[]>([
    new YtpcVolumeEntry(2, 45),
    new Ytpc360Entry(4, 120, 24, 12, 20, 10),
    // new YtpcPlaybackRateEntry(4, 0.5),
    // new YtpcPauseEntry(5, 3),
    // new YtpcGotoEntry(4, 80),
    // new YtpcVolumeEntry(81, 100, 5),
    // new YtpcGotoEntry(83, 7),
    // new YtpcLoopEntry(8, 5, 3)
  ]);

  let videoId = searchParams.get('v');

  if (!videoId) {
    videoId = '_BSSJi-sHh8';
  }

  const opts: Options = {
    playerVars: {
      modestbranding: 1,
    },
  };

  const onReady = (e: { target: YouTubePlayer }) => {
    const yt = e.target;

    let lastTime = 0;
    const aaa = (timestamp: number) => {
      const curTime = yt.getCurrentTime();

      for (const entry of entries) { // TODO: binary search start position
        if (entry.atTime >= lastTime && entry.atTime < curTime) {
          entry.performAction(yt, curTime);
        }
      }
      lastTime = curTime;
      requestAnimationFrame(aaa);
    };

    requestAnimationFrame(aaa);
  };

  return (
    <div>
      <div className="yt-player">
        <YouTube opts={opts} videoId={videoId} onReady={onReady} />
      </div>
      <YouTubePlayerController
        entries={entries}
        setEntries={(entries: YouTubePlayerControllerEntry[]) => setEntries(entries)}
      />
    </div>
  );
}

export default YouTubePlayerContainer;
