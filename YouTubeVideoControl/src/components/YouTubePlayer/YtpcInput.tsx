import React, { ReactElement, useState } from 'react';

import YtpcAdd from './YtpcAdd';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputVolume from './YtpcInputVolume';

export interface YtpcControlInput {
  setControlInputState(state: object): void;
}

function YtpcInput() {
  const [atTime, setAtTime] = useState(0);
  const [controlInput, setControlInput] = useState<(props: any) => JSX.Element>(YtpcInputGoto);
  const [controlInputState, setControlInputState] = useState<object>({});

  const onCreateEntry = () => {
    console.log(controlInputState);
  };

  return (
    <div className='input'>
      <div className='entry-creation'>
        <span>At </span>
        <YtpcInputTime setTime={setAtTime} />
        <span>, </span>
        <YtpcControlSelect setControlInput={() => {}/*setControlInput*/} />
        <YtpcInputVolume setControlInputState={setControlInputState} />
      </div>
      <YtpcAdd onCreateEntry={onCreateEntry} />
    </div>
  );
}

export default YtpcInput;
