import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcPlaybackRateState } from '../../objects/YtpcEntry/YtpcPlaybackRateEntry';

import '../../css/style.min.css';

interface YtpcInputPlaybackRateProps extends YtpcControlInput {
  playbackRates?: number[];
}

const PLAYBACK_RATE_DEFAULT = 1;

function YtpcInputPlaybackRate(props: YtpcInputPlaybackRateProps) {
  const [playbackRate, setPlaybackRate] = useState(PLAYBACK_RATE_DEFAULT);
  const playbackRates = props.playbackRates ?? [PLAYBACK_RATE_DEFAULT];

  const setControlInputState = () => {
    const state: YtpcPlaybackRateState = {
      playbackRate
    };
    props.setControlInputState(state);
  };

  useEffect(() => {
    setControlInputState();
  }, [playbackRate]);

  return (
    <div className="playback-rate">
      <select
        defaultValue={PLAYBACK_RATE_DEFAULT}
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
