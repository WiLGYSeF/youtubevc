import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import YtpcInput360 from './YtpcInput360';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputLoop from './YtpcInputLoop';
import YtpcInputPause from './YtpcInputPause';
import YtpcInputPlaybackRate from './YtpcInputPlaybackRate';
import YtpcInputVolume from './YtpcInputVolume';

interface ControlSelectProps {
  is360Video: boolean;
  defaultControlType: ControlType;
  setControlInput(type: ControlType, component: (props: any) => JSX.Element): void;
}

type Control = {
  enabled: boolean;
  component: (props: any) => JSX.Element;
};

const CONTROLS = new Map<ControlType, Control>([
  [ControlType.ThreeSixty, {
    // enabled: props.is360Video, // only set after video start playing, keep enabled for now
    enabled: true,
    component: YtpcInput360,
  }],
  [ControlType.Goto, {
    enabled: true,
    component: YtpcInputGoto,
  }],
  [ControlType.Loop, {
    enabled: true,
    component: YtpcInputLoop,
  }],
  [ControlType.Pause, {
    enabled: true,
    component: YtpcInputPause,
  }],
  [ControlType.PlaybackRate, {
    enabled: true,
    component: YtpcInputPlaybackRate,
  }],
  [ControlType.Volume, {
    enabled: true,
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
  const { t } = useTranslation();

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
          {t(`ytpcEntry.actions.${type}`)}
        </option>
      ))}
    </select>
  );
}

export interface YtpcControlSelectInputs {
  select: HTMLSelectElement;
}

export function getInputs(container: HTMLElement): YtpcControlSelectInputs {
  return {
    select: container.getElementsByTagName('select')[0],
  };
}

export default YtpcControlSelect;
