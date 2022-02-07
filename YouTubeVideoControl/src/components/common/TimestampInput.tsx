import React, { ChangeEvent, KeyboardEvent } from 'react';

import secondsToTimestamp from '../../utils/secondsToTimestamp';
import timestampToSeconds from '../../utils/timestampToSeconds';
import trimstr from '../../utils/trimstr';
import useStatePropBacked from '../../utils/useStatePropBacked';

interface YtpcInputTimeProps {
  value?: string | number;
  setTime(seconds: number): void;
}

const TIME_PLACEHOLDER = '00:00';

function sanitizeTime(time: string): string {
  return trimstr(trimstr(time, ':'), '.').replace(/::+/, ':');
}

function strToSeconds(str: string): number {
  const sanitized = sanitizeTime(str);
  return sanitized ? timestampToSeconds(sanitized) : 0;
}

function getWidth(str: string): string {
  return `${Math.max(str.length, TIME_PLACEHOLDER.length)}ch`;
}

function YtpcInputTime(props: YtpcInputTimeProps) {
  const value = props.value ?? '';
  const [input, setInput] = useStatePropBacked(typeof value === 'number'
    ? secondsToTimestamp(value)
    : value);
  const [time, setTime] = useStatePropBacked(typeof value === 'number'
    ? value
    : strToSeconds(input));

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    console.log(val);

    if (/^(\d?\d?:){0,3}\d?\d?(\.\d*)?$/.test(val)) {
      setInput(val);

      try {
        const seconds = strToSeconds(val);
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
