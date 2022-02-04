import React, { ChangeEvent, ReactElement, useState } from 'react';

import YtpcInput360 from './YtpcInput360';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputLoop from './YtpcInputLoop';
import YtpcInputPause from './YtpcInputPause';
import YtpcInputPlaybackRate from './YtpcInputPlaybackRate';
import YtpcInputVolume from './YtpcInputVolume';
import Ytpc360Entry from '../../objects/YtpcEntry/Ytpc360Entry';
import YtpcGotoEntry from '../../objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from '../../objects/YtpcEntry/YtpcLoopEntry';
import YtpcPauseEntry from '../../objects/YtpcEntry/YtpcPauseEntry';
import YtpcPlaybackRateEntry from '../../objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcVolumeEntry from '../../objects/YtpcEntry/YtpcVolumeEntry';

import '../../css/style.min.css';

interface ControlSelectProps {
  setControlInput(component?: any): void;
}

type Control = {
  text: string;
  component: (props: any) => JSX.Element;
};

function YtpcControlSelect(props: ControlSelectProps) {
  const controls = new Map<string, Control>([
    ['360', {
      text: Ytpc360Entry.ACTION_STR,
      component: YtpcInput360,
    }],
    ['goto', {
      text: YtpcGotoEntry.ACTION_STR,
      component: YtpcInputGoto,
    }],
    ['loop', {
      text: YtpcLoopEntry.ACTION_STR,
      component: YtpcInputLoop,
    }],
    ['pause', {
      text: YtpcPauseEntry.ACTION_STR,
      component: YtpcInputPause,
    }],
    ['playback-rate', {
      text: YtpcPlaybackRateEntry.ACTION_STR,
      component: YtpcInputPlaybackRate,
    }],
    ['volume', {
      text: YtpcVolumeEntry.ACTION_STR,
      component: YtpcInputVolume,
    }],
  ]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    props.setControlInput(controls.get(e.target.value)?.component);
  };

  return (
    <select onChange={onChange}>
      {Array.from(controls.entries()).map((c) => <option key={c[0]} value={c[0]}>{c[1].text}</option>)}
    </select>
  );
}

export default YtpcControlSelect;
