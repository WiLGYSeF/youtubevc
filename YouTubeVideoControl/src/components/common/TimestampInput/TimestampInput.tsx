import React, {
  ChangeEvent, KeyboardEvent, useEffect,
} from 'react';

import { secondsToTimestamp, timestampToSeconds } from 'utils/timestr';
import trimstr from 'utils/trimstr';
import useStatePropBacked from 'utils/useStatePropBacked';

interface TimestampInputProps {
  defaultValue: number | string;
  onChange(seconds: number): void;
  setInput?(input: string): void;
}

const TIME_PLACEHOLDER = '00:00';

function sanitizeTime(time: string): string {
  return trimstr(time, ':', '.').replace(/::+/, ':');
}

function strToSeconds(str: string): number {
  const sanitized = sanitizeTime(str);
  return sanitized.length ? timestampToSeconds(sanitized) : 0;
}

function getWidth(str: string): string {
  return `${Math.max(str.length, TIME_PLACEHOLDER.length)}ch`;
}

function TimestampInput(props: TimestampInputProps) {
  const value = props.defaultValue ?? '';
  const getInput = () => (secondsToTimestamp(typeof value === 'number'
    ? value
    : strToSeconds(value)
  ));
  const getTime = () => (typeof value === 'number'
    ? value
    : strToSeconds(value)
  );

  const [input, setInput] = useStatePropBacked(getInput());
  const [time, setTime] = useStatePropBacked(getTime());

  useEffect(() => {
    if (props.setInput) {
      props.setInput(input);
    }
  }, []);

  useEffect(() => {
    const updatedInput = getInput();
    const updatedTime = getTime();

    if (props.setInput) {
      props.setInput(updatedInput);
    }
    setInput(updatedInput);
    props.onChange(updatedTime);
    setTime(updatedTime);
  }, [value]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^(\d{0,2}:){0,3}\d{0,2}(\.\d{0,5})?$/.test(val)) {
      if (props.setInput) {
        props.setInput(val);
      }
      setInput(val);

      try {
        const seconds = strToSeconds(val);
        props.onChange(seconds);
        setTime(seconds);
      } catch (exc) {
        props.onChange(-1);
        setTime(-1);
      }
    } else {
      if (props.setInput) {
        props.setInput(input);
      }
      props.onChange(time);
    }
  };

  const updateInput = () => {
    const val = secondsToTimestamp(time);
    if (props.setInput) {
      props.setInput(val);
    }
    setInput(val);
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

export default TimestampInput;
