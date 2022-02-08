import React, {
  ChangeEvent, KeyboardEvent, useEffect, useState,
} from 'react';

import secondsToTimestamp from '../../utils/secondsToTimestamp';
import timestampToSeconds from '../../utils/timestampToSeconds';
import trimstr from '../../utils/trimstr';

interface TimestampInputProps {
  value: number | string;
  onChange(seconds: number): void;
  setInput?(input: string): void;
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

function TimestampInput(props: TimestampInputProps) {
  const value = props.value ?? '';
  const getInput = () => (typeof value === 'number'
    ? secondsToTimestamp(value)
    : value
  );
  const getTime = () => (typeof value === 'number'
    ? value
    : strToSeconds(input)
  );

  const [input, setInput] = useState(getInput());
  const [time, setTime] = useState(getTime());
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInput(getInput());
      setTime(getTime());
    }
  }, [value, isFocused]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^(\d?\d?:){0,3}\d?\d?(\.\d*)?$/.test(val)) {
      props.setInput && props.setInput(val);
      setInput(val);

      try {
        const seconds = strToSeconds(val);
        props.onChange(seconds);
        setTime(seconds);
      } catch (exc) {
        console.error(exc, val, sanitizeTime(val));
        props.onChange(-1);
        setTime(-1);
      }
    }
  };

  const updateInput = () => {
    const input = secondsToTimestamp(time);
    props.setInput && props.setInput(input);
    setInput(input);
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            updateInput();
          }
        }}
      />
    </span>
  );
}

export default TimestampInput;
