import React, { useEffect } from 'react';

import Checkbox from 'components/common/Checkbox';
import NumberInput from 'components/common/NumberInput';
import Ytpc360Entry, { Ytpc360State } from 'objects/YtpcEntry/Ytpc360Entry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import './YtpcInput360.scss';

const LERP_TIME_DEFAULT = 0;

function YtpcInput360(props: YtpcControlInput) {
  const pstate = props.state as Ytpc360State;
  const [yaw, setYaw] = useStatePropBacked(pstate?.sphereProps?.yaw ?? Ytpc360Entry.YAW_DEFAULT);
  const [pitch, setPitch] = useStatePropBacked(pstate?.sphereProps?.pitch ?? Ytpc360Entry.PITCH_DEFAULT);
  const [roll, setRoll] = useStatePropBacked(pstate?.sphereProps?.roll ?? Ytpc360Entry.ROLL_DEFAULT);
  const [fov, setFov] = useStatePropBacked(pstate?.sphereProps?.fov ?? Ytpc360Entry.FOV_DEFAULT);

  const [lerpSet, setLerp] = useStatePropBacked((pstate?.lerpSeconds ?? -1) >= 0);

  const lerpSeconds = pstate?.lerpSeconds ?? -1;
  const [lerpTime, setLerpTime] = useStatePropBacked(lerpSeconds < 0
    ? LERP_TIME_DEFAULT
    : lerpSeconds);

  useEffect(() => {
    const state: Ytpc360State = {
      atTime: pstate.atTime,
      controlType: pstate.controlType,
      sphereProps: {
        yaw: yaw === 360 ? 0 : yaw,
        pitch,
        roll,
        fov,
      },
      lerpSeconds: lerpSet ? lerpTime : -1,
    };
    props.setEntryState(state);
  }, [yaw, pitch, roll, fov, lerpSet, lerpTime]);

  return (
    <div className="three-sixty">
      <NumberInput
        label="yaw: "
        minValue={Ytpc360Entry.YAW_MIN} maxValue={Ytpc360Entry.YAW_MAX} step={null}
        value={yaw}
        clamp={false}
        onChange={setYaw}
      />
      <NumberInput
        label="pitch: "
        minValue={Ytpc360Entry.PITCH_MIN} maxValue={Ytpc360Entry.PITCH_MAX} step={null}
        value={pitch}
        clamp={false}
        onChange={setPitch}
      />
      <NumberInput
        label="roll: "
        minValue={Ytpc360Entry.ROLL_MIN} maxValue={Ytpc360Entry.ROLL_MAX} step={null}
        value={roll}
        clamp={false}
        onChange={setRoll}
      />
      <NumberInput
        label="fov: "
        minValue={Ytpc360Entry.FOV_MIN} maxValue={Ytpc360Entry.FOV_MAX} step={null}
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
