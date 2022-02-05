import React, { ChangeEvent, FocusEvent, useState } from 'react';

import timestampToSeconds from '../../utils/timestampToSeconds';
import trimstr from '../../utils/trimstr';

import '../../css/style.min.css';

interface YtpcInputTimeProps {
  setTime(seconds: number): void;
}

function YtpcInputTime(props: YtpcInputTimeProps) {
  const [input, setInput] = useState('');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^([0-9]{0,2}:){0,2}[0-9]{0,2}$/.test(val)) {
      if (!val.includes('::')) {
        setInput(val);

        try {
          props.setTime(timestampToSeconds(trimstr(val, ':')));
        } catch (exc) {
          props.setTime(-1);
        }
      }
    }
  };

  return (
    <span className="time">
      <input
        value={input}
        placeholder="00:00"
        onChange={onInputChange}
      />
    </span>
  );
}

export default YtpcInputTime;
