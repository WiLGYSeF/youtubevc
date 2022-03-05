import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';
import { YouTubePlayer } from 'youtube-player/dist/types';

import EntryBuilder from 'objects/YtpcEntry/EntryBuilder';
import YouTubePlayerControllerEntry, { ControlType, ExpectedState, YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YouTubePlayer360 } from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import Coroutine from 'utils/coroutine';
import useStatePropBacked from 'utils/useStatePropBacked';
import wrapDetect from 'utils/wrapDetect';
import { getVideoIdByUrl, playerHas360Video } from 'utils/youtube';
import YtpcClear, { getInputs as clearGetInputs, YtpcClearInputs } from './YtpcClear';
import YtpcCopyLink, { getInputs as copyLinkGetInputs, YtpcCopyLinkInputs } from './YtpcCopyLink';
import YtpcEntryList from './YtpcEntryList';
import YtpcExport, { getInputs as exportGetInputs, ExportType, YtpcExportInputs } from './YtpcExport';
import YtpcImport, { getInputs as importGetInputs, YtpcImportInputs } from './YtpcImport';
import YtpcOptions from './YtpcOptions';
import YtpcInput, { getInputs as inputGetInputs, YtpcInputInputs } from './YtpcInput/YtpcInput';

import styles from './YouTubePlayerController.module.scss';

export const EXPORT_TYPE = ExportType.Text;

const EVENT_ONSTATECHANGE = 'onStateChange';

export function addEntry(
  entries: YouTubePlayerControllerEntry[],
  entry: YouTubePlayerControllerEntry,
): void {
  const existingEntryIndex = entries.findIndex(
    (e) => e.atTime === entry.atTime && e.controlType === entry.controlType,
  );

  if (existingEntryIndex === -1) {
    entries.push(entry);
  } else {
    // eslint-disable-next-line no-param-reassign
    entries[existingEntryIndex] = entry;
  }

  entries.sort(
    (
      a: YouTubePlayerControllerEntry,
      b: YouTubePlayerControllerEntry,
    ): number => a.atTime - b.atTime,
  );
}

export function filterLoopEntries(entries: YouTubePlayerControllerEntry[]): YtpcLoopEntry[] {
  return entries.filter((e) => e.controlType === ControlType.Loop) as YtpcLoopEntry[];
}

export function getRandomLoopEntry(
  entries: YouTubePlayerControllerEntry[],
  useLoopCountForWeights: boolean,
): YtpcLoopEntry {
  const loopEntries = filterLoopEntries(entries);
  const loopWeights: number[] = [];

  let highestWeight = 0;
  let totalWeight = 0;

  if (useLoopCountForWeights) {
    highestWeight = Math.max(...loopEntries.map((e) => e.loopCount));
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

  for (; selected < loopEntries.length && random - loopWeights[selected] > 0; selected += 1) {
    random -= loopWeights[selected];
  }
  return loopEntries[selected];
}

interface PerformEntryActionsResult {
  lastMatchingIndex: number,
  expectedState: ExpectedState,
}

export function performEntryActions(
  ytPlayer: YouTubePlayer,
  entries: YouTubePlayerControllerEntry[],
  curTime: number,
  lastTime: number,
  useLoopShuffle: boolean,
  useLoopCountForWeights: boolean,
): PerformEntryActionsResult {
  const expectedState: ExpectedState = {};
  let lastMatchingIndex = -1;
  let idx = 0;

  for (const entry of entries) {
    if (entry.atTime <= curTime) {
      if (entry.atTime >= lastTime) {
        if (entry.controlType === ControlType.Loop && useLoopShuffle) {
          const loopEntry = getRandomLoopEntry(entries, useLoopCountForWeights);
          ytPlayer.seekTo(loopEntry.loopBackTo, true);
          expectedState.currentTime = loopEntry.loopBackTo;
        } else {
          Object.assign(expectedState, entry.performAction(ytPlayer, curTime));
        }
      }
      lastMatchingIndex = idx;
    }
    idx += 1;
  }

  return {
    lastMatchingIndex,
    expectedState,
  };
}

interface YouTubePlayerControllerProps {
  ytPlayer?: YouTubePlayer;
  entries?: string | null;
  loopShuffle: boolean;
  shuffleWeight: boolean;
}

function YouTubePlayerController(props: YouTubePlayerControllerProps) {
  const { t } = useTranslation();

  const [entries, setEntries] = useState<YouTubePlayerControllerEntry[]>([]);
  const [barIndex, setBarIndex] = useState(0);
  // video type is not known until it starts playing
  const [is360Video, setIs360Video] = useState<boolean | undefined>(undefined);
  const [defaultState, setDefaultState] = useState<YtpcEntryState>({
    atTime: 0,
    controlType: ControlType.Goto,
  });
  const [entryState, setEntryState] = useState<YtpcEntryState>(defaultState);
  const [useLoopShuffle, setLoopShuffle] = useStatePropBacked(props.loopShuffle);
  const [useLoopCountForWeights, setUseLoopCountForWeights] = useStatePropBacked(
    props.shuffleWeight,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [controlsWrapped, setControlsWrapped] = useState(false);

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
  }, [props.ytPlayer]);

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
      if (!props.ytPlayer || props.ytPlayer.getPlayerState() !== PlayerStates.PLAYING) {
        return;
      }

      const curTime = props.ytPlayer.getCurrentTime();

      const { lastMatchingIndex, expectedState } = performEntryActions(
        props.ytPlayer,
        entries,
        curTime,
        lastTime,
        useLoopShuffle,
        useLoopCountForWeights,
      );

      setBarIndex(lastMatchingIndex + 1);

      lastTime = expectedState.currentTime ?? curTime;
    });
    routine.start();

    return () => {
      routine.stop();
    };
  }, [props.ytPlayer, entries, useLoopShuffle, useLoopCountForWeights]);

  useEffect(() => {
    const onChange = (arrangement: HTMLElement[][]) => {
      if (arrangement[0].length === 1) {
        if (!controlsWrapped) {
          setControlsWrapped(true);
        }
      } else {
        if (controlsWrapped) {
          setControlsWrapped(false);
        }
      }
    };

    const disconnect = containerRef.current
      ? wrapDetect(containerRef.current, onChange)
      : () => {};

    return () => {
      disconnect();
    };
  }, [containerRef.current, controlsWrapped]);

  return (
    <div className={styles['yt-controller']} ref={containerRef}>
      <div className={['controls', controlsWrapped ? 'fill' : ''].join(' ')}>
        <span data-testid="ytpc-input">
          <YtpcInput
            ytPlayer={props.ytPlayer}
            is360Video={is360Video}
            defaultState={defaultState}
            setDefaultState={setDefaultState}
            entryState={entryState}
            setEntryState={setEntryState}
            createEntry={(state: YtpcEntryState) => {
              const newEntries = [...entries];
              addEntry(newEntries, EntryBuilder.buildEntry(state));
              setEntries(newEntries);
            }}
          />
        </span>

        <span data-testid="entry-list">
          <YtpcEntryList
            entries={entries}
            barIndex={barIndex}
            is360Video={is360Video}
            deleteEntry={(entry: YouTubePlayerControllerEntry): void => {
              setEntries([...entries.filter((e) => e !== entry)]);
            }}
            editEntry={(entry: YouTubePlayerControllerEntry) => {
              setDefaultState(entry.getState());
            }}
          />
        </span>

        <div className="action-buttons">
          <div>
            <span data-testid="ytpc-import">
              <YtpcImport
                addEntry={addEntry}
                setEntries={setEntries}
                onLoad={(success: boolean) => {
                  if (!success) {
                    console.error('file import failed');
                    alert(t('import.failed'));
                  }
                }}
              />
            </span>
            <span data-testid="ytpc-export">
              <YtpcExport
                filename={`youtubevc-${getVideoIdByUrl(props.ytPlayer?.getVideoUrl() ?? '')}.txt`}
                entries={entries}
                exportType={EXPORT_TYPE}
              />
            </span>
            <span data-testid="ytpc-copylink">
              <YtpcCopyLink
                videoId={getVideoIdByUrl(props.ytPlayer?.getVideoUrl() ?? '')}
                entries={entries}
                onCopy={() => {
                  // timeout used to show popup *after* link copied to clipboard
                  setTimeout(() => {
                    alert(t('copyLink.success'));
                  }, 0);
                  return true;
                }}
              />
            </span>
          </div>

          <div>
            <span data-testid="ytpc-clear">
              <YtpcClear clearEntries={() => {
                setEntries([]);
              }}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={['options', controlsWrapped ? 'fill' : ''].join(' ')}>
        <YtpcOptions
          useLoopsForShuffling={useLoopShuffle}
          useLoopCountForWeights={useLoopCountForWeights}
          setLoopsForShuffling={setLoopShuffle}
          setLoopCountForWeights={setUseLoopCountForWeights}
        />
      </div>
    </div>
  );
}

export interface YouTubePlayerControllerInputs {
  input: YtpcInputInputs;
  clear: YtpcClearInputs;
  import: YtpcImportInputs;
  export: YtpcExportInputs;
  copyLink: YtpcCopyLinkInputs;
}

export function getInputs(container: HTMLElement): YouTubePlayerControllerInputs {
  return {
    input: inputGetInputs(container.querySelector('[data-testid="ytpc-input"]')!),
    clear: clearGetInputs(container.querySelector('[data-testid="ytpc-clear"]')!),
    import: importGetInputs(container.querySelector('[data-testid="ytpc-import"]')!),
    export: exportGetInputs(container.querySelector('[data-testid="ytpc-export"]')!),
    copyLink: copyLinkGetInputs(container.querySelector('[data-testid="ytpc-copylink"]')!),
  };
}

export function getEntryList(container: HTMLElement): HTMLElement {
  return container.querySelector('.entry-list')!;
}

export default YouTubePlayerController;
