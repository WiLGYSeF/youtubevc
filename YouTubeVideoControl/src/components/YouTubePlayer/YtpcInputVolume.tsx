import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcVolumeState } from '../../objects/YtpcEntry/YtpcVolumeEntry';

import '../../css/style.min.css';
import Checkbox from '../common/Checkbox';
import NumberInput from '../common/NumberInput';

const VOLUME_MIN = 0;
const VOLUME_MAX = 100;
const VOLUME_DEFAULT = 100;

const LERP_TIME_DEFAULT = 0;

function YtpcInputVolume(props: YtpcControlInput) {
  const [volume, setVolume] = useState(VOLUME_DEFAULT);
  const [lerpSet, setLerp] = useState(false);
  const [lerpTime, setLerpTime] = useState(LERP_TIME_DEFAULT);

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
        min={VOLUME_MIN} max={VOLUME_MAX}
        defaultValue={VOLUME_DEFAULT}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setVolume(Number(e.target.value));
        }}
      />
      <span>{volume}</span>
      <Checkbox
        label="lerp"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLerp(e.target.checked);
        }}
      />
      {lerpSet && (
        <span>
          <span> for </span>
          <NumberInput
            label=" seconds"
            labelLeft={false}
            minValue={0} step={null}
            defaultValue={LERP_TIME_DEFAULT}
            setValue={setLerpTime}
          />
        </span>
      )}
    </div>
  );
}

export default YtpcInputVolume;
