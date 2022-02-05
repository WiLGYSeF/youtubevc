import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import timestampToSeconds from '../../utils/timestampToSeconds';
import trimstr from '../../utils/trimstr';

import '../../css/style.min.css';
import secondsToTimestamp from '../../utils/secondsToTimestamp';

interface YtpcInputTimeProps {
  setTime(seconds: number): void;
}

function YtpcInputTime(props: YtpcInputTimeProps) {
  const [time, setTime] = useState(0);
  const [input, setInput] = useState('');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^([0-9]{0,2}:){0,2}[0-9]{0,2}$/.test(val)) {
      if (!val.includes('::')) {
        setInput(val);

        try {
          const seconds = timestampToSeconds(trimstr(val, ':'));
          props.setTime(seconds);
          setTime(seconds);
        } catch (exc) {
          props.setTime(-1);
          setTime(-1);
        }
      }
    }
  };

  const updateInput = () => {
    setInput(secondsToTimestamp(time));
  };

  return (
    <span className="time">
      <input
        value={input}
        placeholder="00:00"
        onChange={onInputChange}
        onBlur={updateInput}
        onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            updateInput();
          }
        }}
      />
    </span>
  );
}

export default YtpcInputTime;
