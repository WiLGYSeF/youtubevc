import React, { ChangeEvent, useState } from 'react';

import { trimstr } from '../../utils/trimstr';

import '../../css/style.min.css';

interface YtpcInputTimeProps {
  setTime(seconds: number): void;
}

function YtpcInputTime(props: YtpcInputTimeProps) {
  const [input, setInput] = useState('');

  const inputToSeconds = (str: string): number => {
    const match = str.match(/^(?:(?:(?<hour>[0-9]+):)?(?<min>[0-9]+):)?(?<sec>[0-9]+)$/);
    if (!match || !match.groups) {
      throw new Error('invalid timestamp input');
    }

    return Number(match.groups['hour'] ?? 0) * 3600
      + Number(match.groups['min'] ?? 0) * 60
      + Number(match.groups['sec'] ?? 0);
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (/^([0-9]{0,2}:){0,2}[0-9]{0,2}$/.test(val)) {
      if (!val.includes('::')) {
        setInput(val);

        try {
          props.setTime(inputToSeconds(trimstr(val, ':')));
        } catch (e) {
          props.setTime(-1);
        }
      }
    }
  };

  return (
    <span className="time">
      <input
        value={input}
        onChange={onInputChange}
      />
    </span>
  );
}

export default YtpcInputTime;
