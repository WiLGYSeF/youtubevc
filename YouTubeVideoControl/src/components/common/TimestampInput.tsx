import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import secondsToTimestamp from '../../utils/secondsToTimestamp';
import timestampToSeconds from '../../utils/timestampToSeconds';
import trimstr from '../../utils/trimstr';

import '../../css/style.min.css';

interface YtpcInputTimeProps {
  setTime(seconds: number): void;
}

const TIME_PLACEHOLDER = '00:00';

function sanitizeTime(time: string): string {
  return trimstr(time, ':').replace(/::+/, ':');
}

function getWidth(str: string): string {
  return `${Math.max(str.length, TIME_PLACEHOLDER.length)}ch`;
}

function YtpcInputTime(props: YtpcInputTimeProps) {
  const [time, setTime] = useState(0);
  const [input, setInput] = useState('');

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^^(\d?\d?:){0,3}\d?\d?$/.test(val)) {
      setInput(val);

      try {
        const sanitized = sanitizeTime(val);
        const seconds = sanitized ? timestampToSeconds(sanitized) : 0;

        props.setTime(seconds);
        setTime(seconds);
      } catch (exc) {
        console.error(exc, val, sanitizeTime(val));

        props.setTime(-1);
        setTime(-1);
      }
    }
  };

  const updateInput = () => {
    setInput(secondsToTimestamp(time));
  };

  return (
    <span className="timestamp">
      <input
        style={{
          width: getWidth(input),
        }}
        value={input}
        placeholder={TIME_PLACEHOLDER}
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
