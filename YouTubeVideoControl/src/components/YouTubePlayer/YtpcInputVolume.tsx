import React, { ChangeEvent, useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcVolumeState } from '../../objects/YtpcEntry/YtpcVolumeEntry';
import Checkbox from '../common/Checkbox';
import NumberInput from '../common/NumberInput';
import useStatePropBacked from '../../utils/useStatePropBacked';

import '../../css/style.min.css';

const VOLUME_MIN = 0;
const VOLUME_MAX = 100;
const VOLUME_DEFAULT = 100;

const LERP_TIME_DEFAULT = 0;

function YtpcInputVolume(props: YtpcControlInput) {
  const pstate = props.state as YtpcVolumeState;
  const [volume, setVolume] = useStatePropBacked(pstate?.volume ?? VOLUME_DEFAULT);
  const [lerpSet, setLerp] = useStatePropBacked((pstate?.lerpSeconds ?? -1) >= 0);

  const lerpSeconds = pstate?.lerpSeconds ?? -1;
  const [lerpTime, setLerpTime] = useStatePropBacked(lerpSeconds < 0
    ? LERP_TIME_DEFAULT
    : lerpSeconds);

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
        value={volume}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setVolume(Number(e.target.value));
        }}
      />
      <span>{volume}</span>
      <Checkbox
        label="lerp"
        checked={lerpSet}
        setChecked={setLerp}
      />
      {lerpSet && (
        <span>
          <span> for </span>
          <NumberInput
            label=" seconds"
            labelRight
            minValue={0} step={null}
            value={lerpTime}
            forceValue
            setValue={setLerpTime}
          />
        </span>
      )}
    </div>
  );
}

export default YtpcInputVolume;
