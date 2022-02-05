import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcVolumeState } from '../../objects/YtpcEntry/YtpcVolumeEntry';

import '../../css/style.min.css';

function YtpcInputVolume(props: YtpcControlInput) {
  const [volume, setVolume] = useState(100);
  const [lerpSet, setLerp] = useState(false);
  const [lerpTime, setLerpTime] = useState(0);

  const lerpIdInternal = `ytpci-volume-lerp-${Math.random().toString(36).substring(2)}`;

  useEffect(() => {
    const state: YtpcVolumeState = {
      volume,
      lerpSeconds: lerpSet ? lerpTime : -1,
    };
    props.setControlInputState(state);
  }, [volume, lerpSet, lerpTime]);

  return (
    <div className="volume">
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="100"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setVolume(Number(e.target.value));
        }}
      />
      <span>{volume}</span>
      <label htmlFor={lerpIdInternal}>
        <input
          id={lerpIdInternal}
          type="checkbox"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setLerp(e.target.checked);
          }}
        />
        <span>lerp</span>
      </label>
      {lerpSet && (
        <span>
          <span> for </span>
          <input
            type="number"
            min="0"
            step="any"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLerpTime(Number(e.target.value));
            }}
          />
          <span> seconds</span>
        </span>
      )}
    </div>
  );
}

export default YtpcInputVolume;
