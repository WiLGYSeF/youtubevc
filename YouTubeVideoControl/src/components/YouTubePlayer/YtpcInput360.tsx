import React, { useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { Ytpc360State } from '../../objects/YtpcEntry/Ytpc360Entry';
import Checkbox from '../common/Checkbox';
import NumberInput from '../common/NumberInput';
import useStatePropBacked from '../../utils/useStatePropBacked';

import '../../css/style.min.css';

const YAW_MIN = 0;
const YAW_MAX = 360;
const YAW_DEFAULT = 0;

const PITCH_MIN = -90;
const PITCH_MAX = 90;
const PITCH_DEFAULT = 0;

const ROLL_MIN = -180;
const ROLL_MAX = 180;
const ROLL_DEFAULT = 0;

const FOV_MIN = 30;
const FOV_MAX = 120;
const FOV_DEFAULT = 100;

const LERP_TIME_DEFAULT = 0;

function YtpcInput360(props: YtpcControlInput) {
  const pstate = props.state as Ytpc360State;
  const [yaw, setYaw] = useStatePropBacked(pstate?.sphereProps?.yaw ?? YAW_DEFAULT);
  const [pitch, setPitch] = useStatePropBacked(pstate?.sphereProps?.pitch ?? PITCH_DEFAULT);
  const [roll, setRoll] = useStatePropBacked(pstate?.sphereProps?.roll ?? ROLL_DEFAULT);
  const [fov, setFov] = useStatePropBacked(pstate?.sphereProps?.fov ?? FOV_DEFAULT);

  const [lerpSet, setLerp] = useStatePropBacked((pstate?.lerpSeconds ?? -1) >= 0);

  const lerpSeconds = pstate?.lerpSeconds ?? -1;
  const [lerpTime, setLerpTime] = useStatePropBacked(lerpSeconds < 0
    ? LERP_TIME_DEFAULT
    : lerpSeconds);

  useEffect(() => {
    const state: Ytpc360State = {
      sphereProps: {
        yaw: yaw === 360 ? 0 : yaw,
        pitch,
        roll,
        fov,
      },
      lerpSeconds: lerpSet ? lerpTime : -1,
    };
    props.setControlInputState(state);
  }, [yaw, pitch, roll, fov, lerpSet, lerpTime]);

  return (
    <div className="three-sixty">
      <NumberInput
        label="yaw: "
        minValue={YAW_MIN} maxValue={YAW_MAX} step={null}
        value={yaw}
        clamp={false}
        onChange={setYaw}
      />
      <NumberInput
        label="pitch: "
        minValue={PITCH_MIN} maxValue={PITCH_MAX} step={null}
        value={pitch}
        clamp={false}
        onChange={setPitch}
      />
      <NumberInput
        label="roll: "
        minValue={ROLL_MIN} maxValue={ROLL_MAX} step={null}
        value={roll}
        clamp={false}
        onChange={setRoll}
      />
      <NumberInput
        label="fov: "
        minValue={FOV_MIN} maxValue={FOV_MAX} step={null}
        value={fov}
        forceValue
        onChange={setFov}
      />
      <Checkbox
        label="lerp"
        checked={lerpSet}
        onChange={setLerp}
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
            onChange={setLerpTime}
          />
        </span>
      )}
    </div>
  );
}

export default YtpcInput360;
