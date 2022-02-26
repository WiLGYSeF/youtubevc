import React, { ChangeEvent } from 'react';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import Ytpc360Entry from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import YtpcPauseEntry from 'objects/YtpcEntry/YtpcPauseEntry';
import YtpcPlaybackRateEntry from 'objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcVolumeEntry from 'objects/YtpcEntry/YtpcVolumeEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import YtpcInputVolume from './YtpcInputVolume';
import YtpcInputPlaybackRate from './YtpcInputPlaybackRate';
import YtpcInputPause from './YtpcInputPause';
import YtpcInputLoop from './YtpcInputLoop';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInput360 from './YtpcInput360';

interface ControlSelectProps {
  is360Video: boolean;
  defaultControlType: ControlType;
  setControlInput(type: ControlType, component: (props: any) => JSX.Element): void;
}

type Control = {
  enabled: boolean;
  text: string;
  component: (props: any) => JSX.Element;
};

const CONTROLS = new Map<ControlType, Control>([
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

export function getControlTypes(): [ControlType, Function][] {
  return Array.from(CONTROLS.entries()).map(([type, control]) => [type, control.component]);
}

export function controlTypeToComponent(type: ControlType) {
  return CONTROLS.get(type)!.component;
}

function YtpcControlSelect(props: ControlSelectProps) {
  const [controlType, setControlType] = useStatePropBacked(props.defaultControlType);

  return (
    <select
      value={controlType}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value as ControlType;
        setControlType(type);
        props.setControlInput(type, CONTROLS.get(type)!.component);
      }}
    >
      {Array.from(CONTROLS.entries()).map(([type, entry]) => (
        <option key={type} value={type} disabled={!entry.enabled}>
          {entry.text}
        </option>
      ))}
    </select>
  );
}

export default YtpcControlSelect;
