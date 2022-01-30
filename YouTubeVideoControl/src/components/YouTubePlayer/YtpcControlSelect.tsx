import React, { ChangeEvent, ReactElement, useState } from 'react';

import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputLoop from './YtpcInputLoop';

import '../../css/style.min.css';

interface ControlSelectProps {
  setControlInput(element?: ReactElement): void;
}

type Control = {
  text: string;
  element: ReactElement;
}

function YtpcControlSelect(props: ControlSelectProps) {
  const controls = new Map([
    ['goto', {
      text: 'go to',
      element: <YtpcInputGoto />,
    }],
    ['loop', {
      text: 'loop at',
      element: <YtpcInputLoop />,
    }],
  ]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    props.setControlInput(controls.get(e.target.value)?.element);
  };

  return (
    <select onChange={onChange}>
      {Array.from(controls.entries()).map(c => <option value={c[0]}>{c[1].text}</option>)}
    </select>
  );
}

export default YtpcControlSelect;
