import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { SphericalProperties } from '../../objects/YtpcEntry/Ytpc360Entry';
import { clamp } from '../../utils/clamp';

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

interface NumComponentProps {
  label: string;
  minVal: number;
  maxVal: number;
  defaultVal: number;
  clamp?: boolean;
  setValue: (value: number) => void;
}

function NumComponent(props: NumComponentProps): JSX.Element {
  return (
    <label>
      <span>{props.label}: </span>
      <input type="number"
        min={props.minVal} max={props.maxVal} step="any"
        defaultValue={props.defaultVal}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          let num = Number(e.target.value);

          if (props.clamp) {
            num = clamp(num, props.minVal, props.maxVal);
          } else {
            const diff = props.maxVal - props.minVal;

            for (; num < props.minVal; num += diff);
            for (; num > props.maxVal; num -= diff);
          }

          props.setValue(num);
        }}
      />
    </label>
  );
};

function YtpcInput360(props: YtpcControlInput) {
  const [yaw, setYaw] = useState(YAW_DEFAULT);
  const [pitch, setPitch] = useState(PITCH_DEFAULT);
  const [roll, setRoll] = useState(ROLL_DEFAULT);
  const [fov, setFov] = useState(FOV_DEFAULT);

  useEffect(() => {
    const state: SphericalProperties = {
      yaw: yaw === 360 ? 0 : yaw,
      pitch, roll, fov
    };
    props.setControlInputState(state);
  }, [yaw, pitch, roll, fov]);

  return (
    <div className="three-sixty">
      <NumComponent
        label="yaw"
        minVal={YAW_MIN} maxVal={YAW_MAX} defaultVal={YAW_DEFAULT}
        setValue={setYaw}
      />
      <NumComponent
        label="pitch"
        minVal={PITCH_MIN} maxVal={PITCH_MAX} defaultVal={PITCH_DEFAULT}
        setValue={setPitch}
      />
      <NumComponent
        label="roll"
        minVal={ROLL_MIN} maxVal={ROLL_MAX} defaultVal={ROLL_DEFAULT}
        setValue={setRoll}
      />
      <NumComponent
        label="fov"
        minVal={FOV_MIN} maxVal={FOV_MAX} defaultVal={FOV_DEFAULT}
        clamp={true}
        setValue={setFov}
      />
    </div>
  );
}

export default YtpcInput360;
