import React, { useEffect } from 'react';

import Checkbox from 'components/common/Checkbox/Checkbox';
import NumberInput from 'components/common/NumberInput/NumberInput';
import Ytpc360Entry, { Ytpc360State } from 'objects/YtpcEntry/Ytpc360Entry';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import './YtpcInput360.scss';

export const LERP_TIME_DEFAULT = 3;

function YtpcInput360(props: YtpcControlInput) {
  const pstate = props.defaultState as Ytpc360State;
  const dYaw = pstate?.sphereProps?.yaw ?? Ytpc360Entry.YAW_DEFAULT;
  const dPitch = pstate?.sphereProps?.pitch ?? Ytpc360Entry.PITCH_DEFAULT;
  const dRoll = pstate?.sphereProps?.roll ?? Ytpc360Entry.ROLL_DEFAULT;
  const dFov = pstate?.sphereProps?.fov ?? Ytpc360Entry.FOV_DEFAULT;
  const dLerpSeconds = pstate?.lerpSeconds ?? -1;

  const [yaw, setYaw] = useStatePropBacked(dYaw);
  const [pitch, setPitch] = useStatePropBacked(dPitch);
  const [roll, setRoll] = useStatePropBacked(dRoll);
  const [fov, setFov] = useStatePropBacked(dFov);

  const [lerpSet, setLerp] = useStatePropBacked((pstate?.lerpSeconds ?? -1) >= 0);
  const [lerpSeconds, setLerpSeconds] = useStatePropBacked(dLerpSeconds >= 0
    ? dLerpSeconds
    : LERP_TIME_DEFAULT);

  useEffect(() => {
    const state: Ytpc360State = {
      atTime: pstate.atTime,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: yaw === 360 ? 0 : yaw,
        pitch,
        roll,
        fov,
      },
      lerpSeconds: lerpSet ? lerpSeconds : -1,
    };
    props.setEntryState(state);
  }, [yaw, pitch, roll, fov, lerpSet, lerpSeconds]);

  return (
    <div className="three-sixty">
      <span className="yaw">
        <NumberInput
          label="yaw: "
          minValue={Ytpc360Entry.YAW_MIN} maxValue={Ytpc360Entry.YAW_MAX} step={null}
          defaultValue={dYaw}
          clamp={false}
          forceValue
          onChange={setYaw}
        />
      </span>
      <span className="pitch">
        <NumberInput
          label="pitch: "
          minValue={Ytpc360Entry.PITCH_MIN} maxValue={Ytpc360Entry.PITCH_MAX} step={null}
          defaultValue={dPitch}
          clamp={false}
          forceValue
          onChange={setPitch}
        />
      </span>
      <span className="roll">
        <NumberInput
          label="roll: "
          minValue={Ytpc360Entry.ROLL_MIN} maxValue={Ytpc360Entry.ROLL_MAX} step={null}
          defaultValue={dRoll}
          clamp={false}
          forceValue
          onChange={setRoll}
        />
      </span>
      <span className="fov">
        <NumberInput
          label="fov: "
          minValue={Ytpc360Entry.FOV_MIN} maxValue={Ytpc360Entry.FOV_MAX} step={null}
          defaultValue={dFov}
          forceValue
          onChange={setFov}
        />
      </span>
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

export default YtpcInput360;
