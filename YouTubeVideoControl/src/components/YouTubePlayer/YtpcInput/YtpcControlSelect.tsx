import React, { ChangeEvent, useEffect } from 'react';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import Ytpc360Entry from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import YtpcPauseEntry from 'objects/YtpcEntry/YtpcPauseEntry';
import YtpcPlaybackRateEntry from 'objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcVolumeEntry from 'objects/YtpcEntry/YtpcVolumeEntry';
import YtpcInputVolume from './YtpcInputVolume';
import YtpcInputPlaybackRate from './YtpcInputPlaybackRate';
import YtpcInputPause from './YtpcInputPause';
import YtpcInputLoop from './YtpcInputLoop';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInput360 from './YtpcInput360';

interface ControlSelectProps {
  is360Video: boolean;
  controlInputType: ControlType;
  setControlInput(type: ControlType, component: (props: any) => JSX.Element): void;
}

type Control = {
  enabled: boolean;
  text: string;
  component: (props: any) => JSX.Element;
};

function YtpcControlSelect(props: ControlSelectProps) {
  const controls = new Map<string, Control>([
    [ControlType.ThreeSixty, {
      // enabled: props.is360Video, // only set after video start playing, keep enabled for now
      enabled: true,
      text: Ytpc360Entry.ACTION_STR,
      component: YtpcInput360,
    }],
    [ControlType.Goto, {
      enabled: true,
      text: YtpcGotoEntry.ACTION_STR,
      component: YtpcInputGoto,
    }],
    [ControlType.Loop, {
      enabled: true,
      text: YtpcLoopEntry.ACTION_STR,
      component: YtpcInputLoop,
    }],
    [ControlType.Pause, {
      enabled: true,
      text: YtpcPauseEntry.ACTION_STR,
      component: YtpcInputPause,
    }],
    [ControlType.PlaybackRate, {
      enabled: true,
      text: YtpcPlaybackRateEntry.ACTION_STR,
      component: YtpcInputPlaybackRate,
    }],
    [ControlType.Volume, {
      enabled: true,
      text: YtpcVolumeEntry.ACTION_STR,
      component: YtpcInputVolume,
    }],
  ]);

  const setControlInput = (type: ControlType) => {
    const control = controls.get(type) as Control;
    props.setControlInput(type, control.component);
  };

  useEffect(() => {
    setControlInput(props.controlInputType);
  }, [props.controlInputType]);

  return (
    <select
      value={props.controlInputType}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        setControlInput(e.target.value as ControlType);
      }}
    >
      {Array.from(controls.entries()).map((c) => (
        <option key={c[0]} value={c[0]} disabled={!c[1].enabled}>
          {c[1].text}
        </option>
      ))}
    </select>
  );
}

export default YtpcControlSelect;
