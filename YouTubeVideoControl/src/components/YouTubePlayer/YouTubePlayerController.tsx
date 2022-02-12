import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';

import EntryBuilder from 'objects/YtpcEntry/EntryBuilder';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YouTubePlayer360 } from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import Coroutine from 'utils/coroutine';
import useStatePropBacked from 'utils/useStatePropBacked';
import YtpcClear from './YtpcClear';
import YtpcCopyLink from './YtpcCopyLink';
import YtpcEntryList from './YtpcEntryList';
import YtpcExport, { ExportType } from './YtpcExport';
import YtpcImport from './YtpcImport';
import YtpcOptions from './YtpcOptions';
import YtpcInput from './YtpcInput/YtpcInput';

import './YouTubePlayerController.scss';

interface YouTubePlayerControllerProps {
  ytPlayer?: YouTubePlayer;
  entries?: string | null;
  loopShuffle: boolean;
  shuffleWeight: boolean;
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

function getRandomLoopEntry(entries: YouTubePlayerControllerEntry[], useLoopCountForWeights: boolean): YtpcLoopEntry {
  const loopEntries = entries.filter((e) => e.controlType === ControlType.Loop) as YtpcLoopEntry[];
  const loopWeights: number[] = [];

  let highestWeight = 0;
  let totalWeight = 0;

  if (useLoopCountForWeights) {
    for (let i = 0; i < loopEntries.length; highestWeight = Math.max(highestWeight, loopEntries[i].loopCount, i += 1));
  }

  for (const entry of loopEntries) {
    const count = useLoopCountForWeights
      ? entry.loopCount >= 0
        ? entry.loopCount
        : highestWeight
      : 1;
    loopWeights.push(count);
    totalWeight += count;
  }

  let random = Math.floor(Math.random() * (totalWeight + 1));
  let selected = 0;
  for (; selected < loopEntries.length && random - loopWeights[selected] > 0; random -= loopWeights[selected], selected += 1);
  return loopEntries[selected];
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
    new YtpcLoopEntry(5, 1, 2),
  ]);
  const [barIndex, setBarIndex] = useState(0);
  const [is360Video, setIs360Video] = useState(false);
  const [entryState, setEntryState] = useState<YtpcEntryState>({
    atTime: 0,
    controlType: ControlType.Goto
  });
  const [useLoopShuffle, setLoopShuffle] = useStatePropBacked(props.loopShuffle);
  const [useLoopCountForWeights, setUseLoopCountForWeights] = useStatePropBacked(props.shuffleWeight);

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
        (e: YtpcEntryState) => addEntry(parsedEntries, EntryBuilder.buildEntry(e)),
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
            if (entry.controlType === ControlType.Loop && useLoopShuffle) {
              const loopEntry = getRandomLoopEntry(entries, useLoopCountForWeights);
              props.ytPlayer.seekTo(loopEntry.loopBackTo, true);
            } else {
              entry.performAction(props.ytPlayer, curTime);
            }
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
  }, [props.ytPlayer, entries, useLoopShuffle, useLoopCountForWeights]);

  return (
    <div className="yt-controller">
      <div className="controls">
        <YtpcInput
          ytPlayer={props.ytPlayer}
          is360Video={is360Video}
          entryState={entryState}
          createEntry={(state: YtpcEntryState) => {
            const newEntries = [...entries];
            addEntry(newEntries, EntryBuilder.buildEntry(state));
            setEntries(newEntries);
          }}
          setEntryState={setEntryState}
        />

        <YtpcEntryList
          entries={entries}
          barIndex={barIndex}
          deleteEntry={(entry: YouTubePlayerControllerEntry): void => {
            setEntries([...entries.filter((e) => e !== entry)]);
          }}
          editEntry={(entry: YouTubePlayerControllerEntry) => {
            setEntryState(entry.getState());
          }}
        />

        <div>
          <YtpcClear clearEntries={() => {
            setEntries([]);
          }} />
          <YtpcImport addEntry={addEntry} setEntries={setEntries} />
          <YtpcExport
            filename={`youtubevc-${getVideoIdByUrl(props.ytPlayer?.getVideoUrl() ?? '')}.txt`}
            entries={entries}
            exportType={ExportType.Text}
          />
          <YtpcCopyLink videoId={getVideoIdByUrl(props.ytPlayer?.getVideoUrl() ?? '')} entries={entries} />
        </div>
      </div>
      <div className="options">
        <YtpcOptions
          useLoopsForShuffling={useLoopShuffle}
          useLoopCountForWeights={useLoopCountForWeights}
          setLoopsForShuffling={setLoopShuffle}
          setLoopCountForWeights={setUseLoopCountForWeights}
        />
      </div>
      <div className="padding" />
    </div>
  );
}

export default YouTubePlayerController;
