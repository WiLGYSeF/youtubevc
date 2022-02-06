import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';

import { YouTubePlayer360 } from '../../objects/YtpcEntry/Ytpc360Entry';
import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcClear from './YtpcClear';
import YtpcInput from './YtpcInput';
import EntryBuilder from '../../objects/YtpcEntry/EntryBuilder';
import Coroutine from '../../utils/coroutine';

import YtpcLoopEntry from '../../objects/YtpcEntry/YtpcLoopEntry';

import '../../css/style.min.css';
import YtpcEntryList from './YtpcEntryList';
import YtpcGotoEntry from '../../objects/YtpcEntry/YtpcGotoEntry';

interface YouTubePlayerControllerProps {
  ytPlayer?: YouTubePlayer;
}

const EVENT_ONSTATECHANGE = 'onStateChange';

const TIME_DIFF_MAX = 0.1;

function playerHas360Video(player: YouTubePlayer360): boolean {
  return Object.keys(player.getSphericalProperties()).length > 0;
}

function YouTubePlayerController(props: YouTubePlayerControllerProps) {
  const [entries, setEntries] = useState<YouTubePlayerControllerEntry[]>([
    new YtpcGotoEntry(0, 1),
    new YtpcGotoEntry(3, 6),
    new YtpcLoopEntry(7 * 60 + 51, 3 * 60 + 25),
  ]);
  const [barIndex, setBarIndex] = useState(0);
  const [is360Video, setIs360Video] = useState(false);

  useEffect(() => {
    const onStateChange = (e: CustomEvent) => {
      const state: PlayerStates = (e as any).data;
      const has360Video = playerHas360Video(props.ytPlayer as YouTubePlayer360);

      if (is360Video !== has360Video) {
        setIs360Video(has360Video);
      }
    };

    props.ytPlayer?.addEventListener(EVENT_ONSTATECHANGE, onStateChange);

    return () => {
      props.ytPlayer?.removeEventListener(EVENT_ONSTATECHANGE, onStateChange);
    };
  });

  useEffect(() => {
    let lastTime = props.ytPlayer?.getCurrentTime() ?? 0;

    const routine = new Coroutine(() => {
      if (!props.ytPlayer) {
        return;
      }

      const curTime = props.ytPlayer.getCurrentTime();

      let idx = 0;
      let lastMatchingIdx = -1;

      for (const entry of entries) {
        if (entry.atTime < curTime) {
          if (entry.atTime >= Math.max(lastTime, curTime - TIME_DIFF_MAX)) {
            entry.performAction(props.ytPlayer, curTime);
          }
          lastMatchingIdx = idx;
        }
        idx += 1;
      }

      setBarIndex(lastMatchingIdx + 1);

      lastTime = curTime;
    });
    routine.start();

    return () => {
      routine.stop();
    };
  }, [props.ytPlayer, entries]);

  const onCreateEntry = (type: ControlType, atTime: number, state: object): void => {
    const entry = EntryBuilder.buildEntry(type, atTime, state);

    if (entries.find((e) => e.atTime === atTime && e.controlType === type)) {
      throw new Error('entry already present at that time');
    }

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
        <YtpcInput
          ytPlayer={props.ytPlayer}
          is360Video={is360Video}
          onCreateEntry={onCreateEntry}
        />

        <YtpcEntryList
          entries={entries}
          barIndex={barIndex}
          deleteEntry={onDeleteEntry}
        />

        <YtpcClear clearEntries={() => {
          setEntries([]);
        }}
        />
      </div>
      <div className="right" />
    </div>
  );
}

export default YouTubePlayerController;
