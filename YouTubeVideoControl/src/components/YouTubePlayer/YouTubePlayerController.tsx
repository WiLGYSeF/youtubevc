import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';

import Ytpc360Entry, { YouTubePlayer360 } from '../../objects/YtpcEntry/Ytpc360Entry';
import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcClear from './YtpcClear';
import YtpcCopyLink from './YtpcCopyLink';
import YtpcEntryList from './YtpcEntryList';
import YtpcExport, { ExportType } from './YtpcExport';
import YtpcImport from './YtpcImport';
import YtpcInput from './YtpcInput';
import EntryBuilder from '../../objects/YtpcEntry/EntryBuilder';
import Coroutine from '../../utils/coroutine';

import '../../css/style.min.css';

import YtpcGotoEntry from '../../objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from '../../objects/YtpcEntry/YtpcLoopEntry';
import YtpcPauseEntry from '../../objects/YtpcEntry/YtpcPauseEntry';
import YtpcPlaybackRateEntry from '../../objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcVolumeEntry from '../../objects/YtpcEntry/YtpcVolumeEntry';

interface YouTubePlayerControllerProps {
  ytPlayer?: YouTubePlayer;
  entries?: string | null;
}

const EVENT_ONSTATECHANGE = 'onStateChange';

const TIME_DIFF_MAX = 0.1;

function addEntry(entries: YouTubePlayerControllerEntry[], entry: YouTubePlayerControllerEntry): void {
  const existingEntryIndex = entries.findIndex(
    (e) => e.atTime === entry.atTime && e.controlType === entry.controlType,
  );

  if (existingEntryIndex === -1) {
    entries.push(entry);
  } else {
    entries[existingEntryIndex] = entry;
  }

  entries.sort(
    (a: YouTubePlayerControllerEntry, b: YouTubePlayerControllerEntry): number => a.atTime - b.atTime,
  );
}

function getVideoIdByUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch {
    return null;
  }
}

function playerHas360Video(player: YouTubePlayer360): boolean {
  return Object.keys(player.getSphericalProperties()).length > 0;
}

function YouTubePlayerController(props: YouTubePlayerControllerProps) {
  const [entries, setEntries] = useState<YouTubePlayerControllerEntry[]>([
    new YtpcGotoEntry(0, 1),
    new YtpcGotoEntry(3, 6),
    new YtpcPauseEntry(30, 1),
    new YtpcPlaybackRateEntry(31, 2),
    new YtpcVolumeEntry(32, 30, 5),
    new YtpcVolumeEntry(33, 80),
    new Ytpc360Entry(33, {
      yaw: 1, pitch: 2, roll: 3, fov: 5,
    }),
    new Ytpc360Entry(34, {
      yaw: 5, pitch: 2, roll: 3, fov: 5,
    }, 2),
    new YtpcLoopEntry(7 * 60 + 51, 3 * 60 + 25),
    new YtpcLoopEntry(7 * 60 + 52, 3 * 60 + 25, 3),
  ]);
  const [barIndex, setBarIndex] = useState(0);
  const [is360Video, setIs360Video] = useState(false);
  const [atTime, setAtTime] = useState(0);
  const [controlInputType, setControlInputType] = useState(ControlType.Goto);
  const [controlInputState, setControlInputState] = useState<object>({});

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
    if (!props.entries) {
      return;
    }

    try {
      const parsedEntries: YouTubePlayerControllerEntry[] = [];

      JSON.parse(props.entries).forEach(
        (o) => addEntry(parsedEntries, EntryBuilder.buildEntry(o.controlType, o.atTime, o))
      );
      setEntries(parsedEntries);
    } catch (exc) {
      console.error(exc);
    }
  }, [props.entries]);

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

  const deleteEntry = (entry: YouTubePlayerControllerEntry): void => {
    setEntries([...entries.filter((e) => e !== entry)]);
  };

  const editEntry = (entry: YouTubePlayerControllerEntry): void => {
    setAtTime(entry.atTime);
    setControlInputType(entry.controlType);
    setControlInputState(entry.getState());
  };

  const clearEntries = (): void => {
    setEntries([]);
  };

  return (
    <div className="yt-controller">
      <div className="left">
        <YtpcInput
          ytPlayer={props.ytPlayer}
          is360Video={is360Video}
          atTime={atTime}
          controlInputType={controlInputType}
          controlInputState={controlInputState}
          createEntry={(type: ControlType, atTime: number, state: object) => {
            addEntry(entries, EntryBuilder.buildEntry(type, atTime, state));
            setEntries(entries);
          }}
          setControlInputState={setControlInputState}
        />

        <YtpcEntryList
          entries={entries}
          barIndex={barIndex}
          deleteEntry={deleteEntry}
          editEntry={editEntry}
        />

        <div>
          <YtpcClear clearEntries={clearEntries} />
          <YtpcImport addEntry={addEntry} setEntries={setEntries} />
          <YtpcExport
            filename={`youtubevc-${getVideoIdByUrl(props.ytPlayer?.getVideoUrl() ?? '')}.txt`}
            entries={entries}
            exportType={ExportType.Text}
          />
          <YtpcCopyLink videoId={getVideoIdByUrl(props.ytPlayer?.getVideoUrl() ?? '')} entries={entries} />
        </div>
      </div>
      <div className="right" />
    </div>
  );
}

export default YouTubePlayerController;
