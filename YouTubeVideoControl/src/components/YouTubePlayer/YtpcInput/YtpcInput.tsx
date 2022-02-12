import React, { useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import TimestampInput from 'components/common/TimestampInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcAdd from '../YtpcAdd';
import YtpcInputGoto from './YtpcInputGoto';

import './YtpcInput.scss';

interface YtpcInputProps {
  ytPlayer?: YouTubePlayer;
  is360Video: boolean;

  atTime: number;
  controlInputType: ControlType;
  controlInputState: object;

  createEntry(type: ControlType, atTime: number, state: object): void;
  setControlInputState(state: object): void;
}

function YtpcInput(props: YtpcInputProps) {
  const [atTime, setAtTime] = useStatePropBacked(props.atTime);
  const [controlInput, setControlInput] = useState(() => YtpcInputGoto);
  const [controlInputType, setControlInputType] = useStatePropBacked(props.controlInputType);

  return (
    <div className="input">
      <div className="entry-creation">
        <span>At </span>
        <span
          className="now-time"
          title="Click to use current time in video"
          onClick={() => {
            if (props.ytPlayer) {
              const curTime = Math.floor(props.ytPlayer.getCurrentTime() * 100) / 100;
              setAtTime(curTime);
            }
          }}
        >
          *
        </span>
        <TimestampInput
          value={atTime}
          onChange={setAtTime}
        />
        <span>, </span>
        <YtpcControlSelect
          is360Video={props.is360Video}
          controlInputType={controlInputType}
          setControlInput={(type: ControlType, component: (props: any) => JSX.Element) => {
            setControlInput(() => component);
            setControlInputType(type);
          }}
        />
        {React.createElement(controlInput, {
          state: props.controlInputState,
          setControlInputState: props.setControlInputState,
          playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
        })}
      </div>
      <YtpcAdd createEntry={() => props.createEntry(controlInputType, atTime, props.controlInputState)} />
    </div>
  );
}

export default YtpcInput;
