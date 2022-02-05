import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { Ytpc360State } from '../../objects/YtpcEntry/Ytpc360Entry';
import Checkbox from '../common/Checkbox';
import NumberInput from '../common/NumberInput';

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
  const [yaw, setYaw] = useState(YAW_DEFAULT);
  const [pitch, setPitch] = useState(PITCH_DEFAULT);
  const [roll, setRoll] = useState(ROLL_DEFAULT);
  const [fov, setFov] = useState(FOV_DEFAULT);

  const [lerpSet, setLerp] = useState(false);
  const [lerpTime, setLerpTime] = useState(LERP_TIME_DEFAULT);

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
        defaultValue={YAW_DEFAULT}
        clamp={false}
        setValue={setYaw}
      />
      <NumberInput
        label="pitch: "
        minValue={PITCH_MIN} maxValue={PITCH_MAX} step={null}
        defaultValue={PITCH_DEFAULT}
        clamp={false}
        setValue={setPitch}
      />
      <NumberInput
        label="roll: "
        minValue={ROLL_MIN} maxValue={ROLL_MAX} step={null}
        defaultValue={ROLL_DEFAULT}
        clamp={false}
        setValue={setRoll}
      />
      <NumberInput
        label="fov: "
        minValue={FOV_MIN} maxValue={FOV_MAX} step={null}
        defaultValue={FOV_DEFAULT}
        forceValue
        setValue={setFov}
      />
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

export default YtpcInput360;
