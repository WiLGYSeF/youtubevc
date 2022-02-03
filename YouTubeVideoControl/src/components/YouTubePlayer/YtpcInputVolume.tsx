import React, { ChangeEvent, useState } from 'react';

import { YtpcControlInput } from './YtpcInput';

import '../../css/style.min.css';

interface YtpcInputVolumeProps extends YtpcControlInput {

}

function YtpcInputVolume(props: YtpcInputVolumeProps) {
  const [volume, setVolume] = useState(100);
  const [lerpSet, setLerp] = useState(false);
  const [lerpTime, setLerpTime] = useState(0);

  const lerpIdInternal = `ytpci-volume-lerp-${Math.random().toString(36).substring(2)}`;

  const setControlInputState = () => {
    props.setControlInputState({
      volume,
      lerpTime: lerpSet ? lerpTime : -1,
    });
  };

  return (
    <div className="volume">
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="100"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setVolume(Number(e.target.value));
          setControlInputState();
        }}
      />
      <span>{volume}</span>
      <input
        id={lerpIdInternal}
        type="checkbox"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLerp(e.target.checked);
          setControlInputState();
        }}
      />
      <label htmlFor={lerpIdInternal}>lerp</label>
      {lerpSet && (
        <span>
          <span> for </span>
          <input
            type="number"
            min="0"
            step="any"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setLerpTime(Number(e.target.value));
              setControlInputState();
            }}
          />
          <span> seconds</span>
        </span>
      )}
    </div>
  );
}

export default YtpcInputVolume;
