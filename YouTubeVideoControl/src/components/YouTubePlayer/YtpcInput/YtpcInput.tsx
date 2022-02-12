import React, { useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import TimestampInput from 'components/common/TimestampInput';
import { ControlType, YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcAdd from '../YtpcAdd';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcInputGoto from './YtpcInputGoto';

import './YtpcInput.scss';

interface YtpcInputProps {
  ytPlayer?: YouTubePlayer;
  is360Video: boolean;

  entryState: YtpcEntryState;

  createEntry(state: YtpcEntryState): void;
  setEntryState(state: YtpcEntryState): void;
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

              // round time to two decimal places
              state.atTime = Math.floor(props.ytPlayer.getCurrentTime() * 100) / 100;
              props.setEntryState(state);
            }
          }}
        >
          *
        </span>
        <TimestampInput
          value={props.entryState.atTime}
          onChange={(seconds: number) => {
            const state = { ...props.entryState };
            state.atTime = seconds;
            props.setEntryState(state);
          }}
        />
        <span>, </span>
        <YtpcControlSelect
          is360Video={props.is360Video}
          controlInputType={props.entryState.controlType}
          setControlInput={(type: ControlType, component: (props: any) => JSX.Element) => {
            const state = { ...props.entryState };
            state.controlType = type;

            setControlInput(() => component);
            props.setEntryState(state);
          }}
        />
        {React.createElement(controlInput, {
          state: props.entryState,
          setEntryState: props.setEntryState,
          playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
        })}
      </div>
      <YtpcAdd createEntry={() => props.createEntry(props.entryState)} />
    </div>
  );
}

export default YtpcInput;
