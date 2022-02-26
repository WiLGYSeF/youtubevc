import React, { ChangeEvent, useEffect } from 'react';

import Checkbox from 'components/common/Checkbox/Checkbox';
import NumberInput from 'components/common/NumberInput/NumberInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcVolumeState } from 'objects/YtpcEntry/YtpcVolumeEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import './YtpcInputVolume.scss';

const VOLUME_MIN = 0;
const VOLUME_MAX = 100;
const VOLUME_DEFAULT = 100;

export const LERP_TIME_DEFAULT = 3;

function YtpcInputVolume(props: YtpcControlInput) {
  const pstate = props.defaultState as YtpcVolumeState;
  const dVolume = pstate?.volume ?? VOLUME_DEFAULT;
  const dLerpSeconds = pstate?.lerpSeconds ?? -1;

  const [volume, setVolume] = useStatePropBacked(dVolume);

  const [lerpSet, setLerp] = useStatePropBacked((pstate?.lerpSeconds ?? -1) >= 0);
  const [lerpSeconds, setLerpSeconds] = useStatePropBacked(dLerpSeconds >= 0
    ? dLerpSeconds
    : LERP_TIME_DEFAULT);

  useEffect(() => {
    const state: YtpcVolumeState = {
      atTime: props.entryState.atTime,
      controlType: ControlType.Volume,
      volume,
      lerpSeconds: lerpSet ? lerpSeconds : -1,
    };
    props.setEntryState(state);
  }, [volume, lerpSet, lerpSeconds]);

  return (
    <div>
      <span className="volume">
        <input
          type="range"
          min={VOLUME_MIN} max={VOLUME_MAX}
          value={dVolume}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setVolume(Number(e.target.value));
          }}
        />
      </span>
      <span>{volume}</span>
      <span className="lerp">
        <Checkbox
          label="lerp"
          defaultChecked={lerpSet}
          onChange={setLerp}
        />
      </span>
      <span
        className="lerp-seconds" style={{
          display: lerpSet ? '' : 'none',
        }}
      >
        <span> for </span>
        <NumberInput
          label=" seconds"
          labelRight
          minValue={0} step={null}
          defaultValue={dLerpSeconds >= 0 ? dLerpSeconds : LERP_TIME_DEFAULT}
          forceValue
          onChange={setLerpSeconds}
        />
      </span>
    </div>
  );
}

export default YtpcInputVolume;
