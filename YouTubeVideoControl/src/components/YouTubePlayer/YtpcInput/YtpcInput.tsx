import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { YouTubePlayer } from 'youtube-player/dist/types';

import TimestampInput, { getInputs as timestampGetInputs, TimestampInputsInput } from 'components/common/TimestampInput/TimestampInput';
import { ControlType, YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import round from 'utils/round';
import YtpcAdd, { getInputs as addGetInputs, YtpcAddInputs } from '../YtpcAdd';
import { YtpcControlInput } from './YtpcControlInput';
import YtpcControlSelect, { controlTypeToComponent, getInputs as controlSelectGetInputs, YtpcControlSelectInputs } from './YtpcControlSelect';
import { getInputs as gotoGetInputs } from './YtpcInputGoto';
import { getInputs as loopGetInputs } from './YtpcInputLoop';
import { getInputs as pauseGetInputs } from './YtpcInputPause';
import { getInputs as playbackRateGetInputs } from './YtpcInputPlaybackRate';
import { getInputs as threeSixtyGetInputs } from './YtpcInput360';
import { getInputs as volumeGetInputs } from './YtpcInputVolume';

import styles from './YtpcInput.module.scss';

interface YtpcInputProps {
  ytPlayer?: YouTubePlayer;
  is360Video: boolean;

  defaultState: YtpcEntryState;
  setDefaultState(state: YtpcEntryState): void;
  entryState: YtpcEntryState;
  setEntryState(state: YtpcEntryState): void;

  createEntry(state: YtpcEntryState): void;
}

function YtpcInput(props: YtpcInputProps) {
  const { t } = useTranslation();

  const component = controlTypeToComponent(props.defaultState.controlType);
  const [controlInput, setControlInput] = useState(() => component);

  const createComponent = (input: YtpcControlInput) => React.createElement(controlInput, input);

  useEffect(() => {
    setControlInput(() => component);
  }, [props.defaultState.controlType]);

  return (
    <div className={styles.input}>
      <div className="entry-creation">
        <span>
          {t('youtubeController.at')}
          {' '}
        </span>
        <span
          className="now-time"
          title={t('youtubeController.nowTimeHover')}
          onClick={() => {
            if (props.ytPlayer) {
              const state = { ...props.defaultState };

              state.atTime = round(props.ytPlayer.getCurrentTime(), 2);
              props.setDefaultState(state);
            }
          }}
        >
          *
        </span>
        <span data-testid="at-time">
          <TimestampInput
            defaultValue={props.defaultState.atTime}
            onChange={(seconds: number) => {
              const state = { ...props.entryState };
              state.atTime = seconds;
              props.setEntryState(state);
            }}
          />
        </span>
        <span>, </span>
        <span data-testid="control-select">
          <YtpcControlSelect
            is360Video={props.is360Video}
            defaultControlType={props.defaultState.controlType}
            setControlInput={(type, component) => {
              const state = { ...props.entryState };
              state.controlType = type;

              setControlInput(() => component);
              props.setEntryState(state);
            }}
          />
        </span>
        <span data-testid="control-input">
          {createComponent({
            entryState: props.entryState,
            defaultState: props.defaultState,
            setEntryState: props.setEntryState,
            playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
          })}
        </span>
      </div>
      <span data-testid="add">
        <YtpcAdd createEntry={() => props.createEntry(props.entryState)} />
      </span>
    </div>
  );
}

export interface YtpcInputInputs {
  nowTime: HTMLElement;
  atTime: TimestampInputsInput;
  controlSelect: YtpcControlSelectInputs;
  controlInput: HTMLElement;
  add: YtpcAddInputs;
}

export function getInputs(container: HTMLElement): YtpcInputInputs {
  return {
    nowTime: container.querySelector('.now-time')!,
    atTime: timestampGetInputs(container.querySelector('[data-testid="at-time"]')!),
    controlSelect: controlSelectGetInputs(container.querySelector('[data-testid="control-select"]')!),
    controlInput: container.querySelector('[data-testid="control-input"]')!,
    add: addGetInputs(container.querySelector('[data-testid="add"]')!),
  };
}

export function getInputsByControl(container: HTMLElement, type: ControlType): any {
  let inputs;

  switch (type) {
    case ControlType.Goto:
      inputs = gotoGetInputs(container);
      break;
    case ControlType.Loop:
      inputs = loopGetInputs(container);
      break;
    case ControlType.Pause:
      inputs = pauseGetInputs(container);
      break;
    case ControlType.PlaybackRate:
      inputs = playbackRateGetInputs(container);
      break;
    case ControlType.ThreeSixty:
      inputs = threeSixtyGetInputs(container);
      break;
    case ControlType.Volume:
      inputs = volumeGetInputs(container);
      break;
    default:
      inputs = null;
      break;
  }

  if (inputs) {
    for (const value of Object.values(inputs)) {
      if (!value) {
        return null;
      }
    }
  }

  return inputs;
}

export default YtpcInput;
