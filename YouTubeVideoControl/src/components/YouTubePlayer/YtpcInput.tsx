import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcAdd from './YtpcAdd';
import YtpcInputGoto from './YtpcInputGoto';
import TimestampInput from '../common/TimestampInput';
import secondsToTimestamp from '../../utils/secondsToTimestamp';

import '../../css/style.min.css';

interface YtpcInputProps {
  ytPlayer?: YouTubePlayer;
  is360Video: boolean;

  controlInputType: ControlType;

  createEntry(type: ControlType, atTime: number, state: object): void;
}

function YtpcInput(props: YtpcInputProps) {
  const [atTime, setAtTime] = useState(0);
  const [nowTime, setNowTime] = useState(0);
  const [controlInput, setControlInput] = useState(() => YtpcInputGoto);
  const [controlInputType, setControlInputType] = useState(props.controlInputType);
  const [controlInputState, setControlInputState] = useState<object>({});

  useEffect(() => {
    setControlInputType(props.controlInputType);
  }, [props.controlInputType]);

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
              setNowTime(curTime);
            }
          }}
        >
          *
        </span>
        <TimestampInput
          defaultValue={secondsToTimestamp(nowTime)}
          setTime={setAtTime}
        />
        <span>, </span>
        <YtpcControlSelect
          is360Video={props.is360Video}
          controlInputType={controlInputType}
          setControlInput={(type: ControlType, component?: any) => {
            setControlInput(component);
            setControlInputType(type);
          }}
        />
        {React.createElement(controlInput, {
          setControlInputState,
          playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
        })}
      </div>
      <YtpcAdd createEntry={() => props.createEntry(controlInputType, atTime, controlInputState)} />
    </div>
  );
}

export default YtpcInput;
