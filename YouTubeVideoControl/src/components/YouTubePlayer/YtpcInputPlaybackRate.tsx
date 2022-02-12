import React, { ChangeEvent, useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcPlaybackRateState } from '../../objects/YtpcEntry/YtpcPlaybackRateEntry';
import useStatePropBacked from '../../utils/useStatePropBacked';

import '../../css/style.min.css';

interface YtpcInputPlaybackRateProps extends YtpcControlInput {
  playbackRates?: number[];
}

const PLAYBACK_RATE_DEFAULT = 1;

function YtpcInputPlaybackRate(props: YtpcInputPlaybackRateProps) {
  const pstate = props.state as YtpcPlaybackRateState;
  const [playbackRate, setPlaybackRate] = useStatePropBacked(pstate?.playbackRate ?? PLAYBACK_RATE_DEFAULT);
  const playbackRates = props.playbackRates ?? [PLAYBACK_RATE_DEFAULT];

  useEffect(() => {
    const state: YtpcPlaybackRateState = {
      playbackRate,
    };
    props.setControlInputState(state);
  }, [playbackRate]);

  return (
    <div className="playback-rate">
      <select
        defaultValue={playbackRate}
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
