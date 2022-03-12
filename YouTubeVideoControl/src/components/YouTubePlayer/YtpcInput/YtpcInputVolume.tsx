import React, { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox, { getInputs as checkboxGetInputs, CheckboxInputs } from 'components/common/Checkbox/Checkbox';
import NumberInput, { getInputs as numberGetInputs, NumberInputInputs } from 'components/common/NumberInput/NumberInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcVolumeState } from 'objects/YtpcEntry/YtpcVolumeEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import styles from './YtpcInputVolume.module.scss';

const VOLUME_MIN = 0;
const VOLUME_MAX = 100;
const VOLUME_DEFAULT = 100;

export const LERP_TIME_DEFAULT = 3;

function YtpcInputVolume(props: YtpcControlInput) {
  const { t } = useTranslation();

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
    <span className={styles.volume}>
      <span data-testid="volume">
        <input
          type="range"
          min={VOLUME_MIN} max={VOLUME_MAX}
          value={volume}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setVolume(Number(e.target.value));
          }}
        />
      </span>
      <span>{volume}</span>
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

export interface YtpcInputVolumeInputs {
  volume: HTMLInputElement;
  lerp: CheckboxInputs;
  lerpSeconds: NumberInputInputs;
}

export function getInputs(container: HTMLElement): YtpcInputVolumeInputs {
  return {
    volume: container.querySelector('.volume input')!,
    lerp: checkboxGetInputs(container.querySelector('[data-testid="lerp"]')!),
    lerpSeconds: numberGetInputs(container.querySelector('[data-testid="lerp-seconds"]')!),
  };
}

export default YtpcInputVolume;
