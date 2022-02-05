import React, { useEffect, useState } from 'react';

import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcEntry from './YtpcEntry';
import YtpcInput from './YtpcInput';
import EntryBuilder from '../../objects/YtpcEntry/EntryBuilder';
import Coroutine from '../../utils/coroutine';

import YtpcLoopEntry from '../../objects/YtpcEntry/YtpcLoopEntry';

import '../../css/style.min.css';
import { YouTubePlayer } from 'youtube-player/dist/types';

interface YouTubePlayerControllerProps {
  ytPlayer?: YouTubePlayer;
}

function YouTubePlayerController(props: YouTubePlayerControllerProps) {
  const [entries, setEntries] = useState<YouTubePlayerControllerEntry[]>([
    new YtpcLoopEntry(7 * 60 + 51, 3 * 60 + 25),
  ]);

  useEffect(() => {
    let lastTime = 0;

    const routine = new Coroutine(() => {
      if (!props.ytPlayer) {
        return;
      }

      const curTime = props.ytPlayer.getCurrentTime();

      for (const entry of entries) {
        if (entry.atTime >= lastTime && entry.atTime < curTime) {
          entry.performAction(props.ytPlayer, curTime);
        }
      }

      lastTime = curTime;
    });
    routine.start();

    return () => {
      routine.stop();
    };
  });

  const onCreateEntry = (type: ControlType, atTime: number, state: object): void => {
    const entry = EntryBuilder.buildEntry(type, atTime, state);

    setEntries([...entries, entry].sort(
      (a: YouTubePlayerControllerEntry, b: YouTubePlayerControllerEntry): number => a.atTime - b.atTime,
    ));
  };

  const onDeleteEntry = (entry: YouTubePlayerControllerEntry): void => {
    setEntries([...entries.filter((e) => e !== entry)]);
  };

  return (
    <div className="yt-controller">
      <div className="left">
        <YtpcInput onCreateEntry={onCreateEntry} />

        <div className="entry-list">
          {entries.map((e, i) => (
            <YtpcEntry
              key={`${i}-${e.getKey()}`}
              entry={e}
              onDeleteEntry={onDeleteEntry}
            />
          ))}
        </div>
      </div>
      <div className="right" />
    </div>
  );
}

export default YouTubePlayerController;
