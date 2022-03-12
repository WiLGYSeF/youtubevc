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
  is360Video?: boolean;
  defaultControlType: ControlType;
  setControlInput(type: ControlType, component: (props: any) => JSX.Element): void;
}

const CONTROLS = new Map<ControlType, (props: any) => JSX.Element>([
  [ControlType.ThreeSixty, YtpcInput360],
  [ControlType.Goto, YtpcInputGoto],
  [ControlType.Loop, YtpcInputLoop],
  [ControlType.Pause, YtpcInputPause],
  [ControlType.PlaybackRate, YtpcInputPlaybackRate],
  [ControlType.Volume, YtpcInputVolume],
]);

export function getControlTypes(): [ControlType, (props: any) => JSX.Element][] {
  return Array.from(CONTROLS.entries());
}

export function controlTypeToComponent(type: ControlType) {
  return CONTROLS.get(type)!;
}

export function isControlDisabledIfNot360Video(type: ControlType): boolean {
  return type === ControlType.ThreeSixty;
}

function YtpcControlSelect(props: ControlSelectProps) {
  const { t } = useTranslation();

  const [controlType, setControlType] = useStatePropBacked(props.defaultControlType);

  const is360Video: boolean = props.is360Video ?? true;

  const controlList = Array.from(CONTROLS.keys());
  const enabledControls = controlList.map(() => true);

  if (!is360Video) {
    controlList.forEach((type, i) => {
      if (isControlDisabledIfNot360Video(type)) {
        enabledControls[i] = false;
      }
    });
  }

  return (
    <select
      value={controlType}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value as ControlType;
        setControlType(type);
        props.setControlInput(type, controlTypeToComponent(type));
      }}
    >
      {controlList.map((type, i) => (
        <option key={type} value={type} disabled={!enabledControls[i]}>
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
