import React, { ChangeEvent, useEffect } from 'react';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcPlaybackRateState } from 'objects/YtpcEntry/YtpcPlaybackRateEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

interface YtpcInputPlaybackRateProps extends YtpcControlInput {
  playbackRates?: number[];
}

const PLAYBACK_RATE_DEFAULT = 1;

function YtpcInputPlaybackRate(props: YtpcInputPlaybackRateProps) {
  const pstate = props.defaultState as YtpcPlaybackRateState;
  const dPlaybackRate = pstate.playbackRate ?? PLAYBACK_RATE_DEFAULT;

  const [playbackRate, setPlaybackRate] = useStatePropBacked(dPlaybackRate);
  const playbackRates = props.playbackRates ?? [PLAYBACK_RATE_DEFAULT];

  useEffect(() => {
    const state: YtpcPlaybackRateState = {
      atTime: props.entryState.atTime,
      controlType: ControlType.PlaybackRate,
      playbackRate,
    };
    props.setEntryState(state);
  }, [playbackRate]);

  return (
    <div data-testid="playback-rate">
      <select
        value={playbackRate}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setPlaybackRate(Number(e.target.value));
        }}
      >
        {playbackRates.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
    </div>
  );
}

export default YtpcInputPlaybackRate;
