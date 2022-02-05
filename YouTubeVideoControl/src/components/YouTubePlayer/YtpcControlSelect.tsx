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
import { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

interface ControlSelectProps {
  setControlInput(component?: any): void;
}

type Control = {
  text: string;
  component: (props: any) => JSX.Element;
};

function YtpcControlSelect(props: ControlSelectProps) {
  const controls = new Map<string, Control>([
    [ControlType.ThreeSixty, {
      text: Ytpc360Entry.ACTION_STR,
      component: YtpcInput360,
    }],
    [ControlType.Goto, {
      text: YtpcGotoEntry.ACTION_STR,
      component: YtpcInputGoto,
    }],
    [ControlType.Loop, {
      text: YtpcLoopEntry.ACTION_STR,
      component: YtpcInputLoop,
    }],
    [ControlType.Pause, {
      text: YtpcPauseEntry.ACTION_STR,
      component: YtpcInputPause,
    }],
    [ControlType.PlaybackRate, {
      text: YtpcPlaybackRateEntry.ACTION_STR,
      component: YtpcInputPlaybackRate,
    }],
    [ControlType.Volume, {
      text: YtpcVolumeEntry.ACTION_STR,
      component: YtpcInputVolume,
    }],
  ]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    props.setControlInput(() => controls.get(e.target.value)?.component);
  };

  return (
    <select onChange={onChange} defaultValue={ControlType.Goto}>
      {Array.from(controls.entries()).map((c) =>
        <option key={c[0]} value={c[0]}>
          {c[1].text}
        </option>
      )}
    </select>
  );
}

export default YtpcControlSelect;
