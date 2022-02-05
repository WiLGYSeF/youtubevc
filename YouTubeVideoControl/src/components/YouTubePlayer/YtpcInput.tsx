import React, { useState } from 'react';

import { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcAdd from './YtpcAdd';
import YtpcInputGoto from './YtpcInputGoto';
import TimestampInput from '../common/TimestampInput';

import '../../css/style.min.css';

interface YtpcInputProps {
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
        <YtpcControlSelect setControlInput={(type: ControlType, component?: any) => {
          setControlInput(component);
          setControlInputType(type);
        }}
        />
        {React.createElement(controlInput, {
          setControlInputState,
          playbackRates: undefined,
        })}
      </div>
      <YtpcAdd onCreateEntry={() => props.onCreateEntry(controlInputType, atTime, controlInputState)} />
    </div>
  );
}

export default YtpcInput;
