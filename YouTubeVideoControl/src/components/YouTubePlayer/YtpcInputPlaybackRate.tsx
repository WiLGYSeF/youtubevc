import React, { ChangeEvent, useState } from 'react';

import { YtpcControlInput } from './YtpcInput';

import '../../css/style.min.css';

interface YtpcInputPlaybackRateProps extends YtpcControlInput {
  playbackRates: number[];
}

function YtpcInputPlaybackRate(props: YtpcInputPlaybackRateProps) {
  return (
    <div className="playback-rate">
      <select>
        {props.playbackRates.map((r) => <option key={r} value={r}>r</option>)}
      </select>
    </div>
  );
}

export default YtpcInputPlaybackRate;
