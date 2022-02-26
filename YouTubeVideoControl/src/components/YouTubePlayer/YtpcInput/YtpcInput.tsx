import React, { useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import TimestampInput from 'components/common/TimestampInput/TimestampInput';
import { YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import round from 'utils/round';
import YtpcAdd from '../YtpcAdd';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcInputGoto from './YtpcInputGoto';

import './YtpcInput.scss';

interface YtpcInputProps {
  ytPlayer?: YouTubePlayer;
  is360Video: boolean;

  defaultState: YtpcEntryState;
  entryState: YtpcEntryState;
  setEntryState(state: YtpcEntryState): void;

  createEntry(state: YtpcEntryState): void;
}

function YtpcInput(props: YtpcInputProps) {
  const [controlInput, setControlInput] = useState(() => YtpcInputGoto);

  return (
    <div className="input">
      <div className="entry-creation">
        <span>At </span>
        <span
          className="now-time"
          title="Click to use current time in video"
          onClick={() => {
            if (props.ytPlayer) {
              const state = { ...props.entryState };

              state.atTime = round(props.ytPlayer.getCurrentTime(), 2);
              props.setEntryState(state);
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
        {React.createElement(controlInput, {
          defaultState: props.defaultState,
          setEntryState: props.setEntryState,
          playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
        })}
      </div>
      <YtpcAdd createEntry={() => props.createEntry(props.entryState)} />
    </div>
  );
}

export default YtpcInput;
