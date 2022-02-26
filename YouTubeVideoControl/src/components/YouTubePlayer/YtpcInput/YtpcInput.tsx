import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import TimestampInput from 'components/common/TimestampInput/TimestampInput';
import { YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import round from 'utils/round';
import YtpcAdd from '../YtpcAdd';
import { YtpcControlInput } from './YtpcControlInput';
import YtpcControlSelect, { controlTypeToComponent } from './YtpcControlSelect';

import './YtpcInput.scss';

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
  const component = controlTypeToComponent(props.defaultState.controlType);
  const [controlInput, setControlInput] = useState(() => component);

  const createComponent = (input: YtpcControlInput) => React.createElement(controlInput, input);

  useEffect(() => {
    setControlInput(() => component);
  }, [props.defaultState.controlType]);

  return (
    <div className="input">
      <div className="entry-creation">
        <span>At </span>
        <span
          className="now-time"
          title="Click to use current time in video"
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
        <span className="at-time">
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
        <span className="control-select">
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
        <span className="control-input">
          {createComponent({
            entryState: props.entryState,
            defaultState: props.defaultState,
            setEntryState: props.setEntryState,
            playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
          })}
        </span>
      </div>
      <span className="add">
        <YtpcAdd createEntry={() => props.createEntry(props.entryState)} />
      </span>
    </div>
  );
}

export default YtpcInput;
