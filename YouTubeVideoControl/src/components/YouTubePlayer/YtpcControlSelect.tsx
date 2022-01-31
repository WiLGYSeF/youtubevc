import React, { ChangeEvent, ReactElement, useState } from 'react';

import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputLoop from './YtpcInputLoop';
import YtpcInputVolume from './YtpcInputVolume';

import '../../css/style.min.css';

interface ControlSelectProps {
  setControlInput(component?: any): void;
}

type Control = {
  text: string;
  component: (props: any) => JSX.Element;
}

function YtpcControlSelect(props: ControlSelectProps) {
  const controls = new Map<string, Control>([
    ['goto', {
      text: 'go to',
      component: YtpcInputGoto,
    }],
    ['loop', {
      text: 'loop back to',
      component: YtpcInputLoop,
    }],
    ['volume', {
      text: 'set volume to',
      component: YtpcInputVolume,
    }],
  ]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    props.setControlInput(controls.get(e.target.value)?.component);
  };

  return (
    <select onChange={onChange}>
      {Array.from(controls.entries()).map(c => <option key={c[0]} value={c[0]}>{c[1].text}</option>)}
    </select>
  );
}

export default YtpcControlSelect;
