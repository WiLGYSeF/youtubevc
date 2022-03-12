import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox, { getInputs as checkboxGetInputs, CheckboxInputs } from 'components/common/Checkbox/Checkbox';
import NumberInput, { getInputs as numberGetInputs, NumberInputInputs } from 'components/common/NumberInput/NumberInput';
import Ytpc360Entry, { Ytpc360State } from 'objects/YtpcEntry/Ytpc360Entry';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import styles from './YtpcInput360.module.scss';

export const LERP_TIME_DEFAULT = 3;

function YtpcInput360(props: YtpcControlInput) {
  const { t } = useTranslation();

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
      atTime: props.entryState.atTime,
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
    <span className={styles['three-sixty']}>
      <span data-testid="yaw">
        <NumberInput
          label={`${t('youtubeController.yaw')}: `}
          minValue={Ytpc360Entry.YAW_MIN} maxValue={Ytpc360Entry.YAW_MAX} step={null}
          defaultValue={dYaw}
          clamp={false}
          forceValue
          onChange={setYaw}
        />
      </span>
      <span data-testid="pitch">
        <NumberInput
          label={`${t('youtubeController.pitch')}: `}
          minValue={Ytpc360Entry.PITCH_MIN} maxValue={Ytpc360Entry.PITCH_MAX} step={null}
          defaultValue={dPitch}
          clamp={false}
          forceValue
          onChange={setPitch}
        />
      </span>
      <span data-testid="roll">
        <NumberInput
          label={`${t('youtubeController.roll')}: `}
          minValue={Ytpc360Entry.ROLL_MIN} maxValue={Ytpc360Entry.ROLL_MAX} step={null}
          defaultValue={dRoll}
          clamp={false}
          forceValue
          onChange={setRoll}
        />
      </span>
      <span data-testid="fov">
        <NumberInput
          label={`${t('youtubeController.fov')}: `}
          minValue={Ytpc360Entry.FOV_MIN} maxValue={Ytpc360Entry.FOV_MAX} step={null}
          defaultValue={dFov}
          forceValue
          onChange={setFov}
        />
      </span>
      <span data-testid="lerp">
        <Checkbox
          label={t('youtubeController.lerp')}
          defaultChecked={lerpSet}
          onChange={setLerp}
        />
      </span>
      <span
        data-testid="lerp-seconds" style={{
          display: lerpSet ? '' : 'none',
        }}
      >
        <span>
          {' '}
          {t('for')}
          {' '}
        </span>
        <NumberInput
          label={` ${t('seconds')}`}
          labelRight
          minValue={0} step={null}
          defaultValue={dLerpSeconds >= 0 ? dLerpSeconds : LERP_TIME_DEFAULT}
          forceValue
          onChange={setLerpSeconds}
        />
      </span>
    </span>
  );
}

export interface YtpcInput360Inputs {
  yaw: NumberInputInputs;
  pitch: NumberInputInputs;
  roll: NumberInputInputs;
  fov: NumberInputInputs;
  lerp: CheckboxInputs;
  lerpSeconds: NumberInputInputs;
}

export function getInputs(container: HTMLElement): YtpcInput360Inputs {
  return {
    yaw: numberGetInputs(container.querySelector('[data-testid="yaw"]')!),
    pitch: numberGetInputs(container.querySelector('[data-testid="pitch"]')!),
    roll: numberGetInputs(container.querySelector('[data-testid="roll"]')!),
    fov: numberGetInputs(container.querySelector('[data-testid="fov"]')!),
    lerp: checkboxGetInputs(container.querySelector('[data-testid="lerp"]')!),
    lerpSeconds: numberGetInputs(container.querySelector('[data-testid="lerp-seconds"]')!),
  };
}

export default YtpcInput360;
