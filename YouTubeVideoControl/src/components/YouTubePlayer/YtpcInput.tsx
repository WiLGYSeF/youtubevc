import React, { useState } from 'react';

import YtpcControlSelect from './YtpcControlSelect';
import YtpcAdd from './YtpcAdd';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

function YtpcInput() {
  const [atTime, setAtTime] = useState(0);
  const [controlInput, setControlInput] = useState(() => YtpcInputGoto);
  const [controlInputState, setControlInputState] = useState<object>({});

  const onCreateEntry = () => {
    console.log(atTime, controlInputState);
  };

  return (
    <div className="input">
      <div className="entry-creation">
        <span>At </span>
        <YtpcInputTime setTime={setAtTime} />
        <span>, </span>
        <YtpcControlSelect setControlInput={setControlInput} />
        {React.createElement(controlInput, {
          setControlInputState,
          playbackRates: undefined,
        })}
      </div>
      <YtpcAdd onCreateEntry={onCreateEntry} />
    </div>
  );
}

export default YtpcInput;
