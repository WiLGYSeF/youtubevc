import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcAdd from './YtpcAdd';
import YtpcInputGoto from './YtpcInputGoto';
import TimestampInput from '../common/TimestampInput';

import '../../css/style.min.css';

interface YtpcInputProps {
  ytPlayer?: YouTubePlayer;
  is360Video: boolean,
  onCreateEntry(type: ControlType, atTime: number, state: object): void;
}

function YtpcInput(props: YtpcInputProps) {
  const [atTime, setAtTime] = useState(0);
  const [controlInput, setControlInput] = useState(() => YtpcInputGoto);
  const [controlInputType, setControlInputType] = useState(ControlType.Goto);
  const [controlInputState, setControlInputState] = useState<object>({});

  return (
    <div className="input">
      <div className="entry-creation">
        <span>At </span>
        <TimestampInput setTime={setAtTime} />
        <span>, </span>
        <YtpcControlSelect
          setControlInput={(type: ControlType, component?: any) => {
            setControlInput(component);
            setControlInputType(type);
          }}
          is360Video={props.is360Video}
        />
        {React.createElement(controlInput, {
          setControlInputState,
          playbackRates: props.ytPlayer?.getAvailablePlaybackRates(),
        })}
      </div>
      <YtpcAdd createEntry={() => props.onCreateEntry(controlInputType, atTime, controlInputState)} />
    </div>
  );
}

export default YtpcInput;
