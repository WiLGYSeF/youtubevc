import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcGotoState } from 'objects/YtpcEntry/YtpcGotoEntry';
import { getFiberNode, getNameFromFiberNode } from 'utils/test/fiberNode';
import { getInputs as addGetInputs, YtpcAddInputs } from '../YtpcAdd.test';
import { getInputs as controlSelectGetInputs, YtpcControlSelectInputs } from './YtpcControlSelect.test';
import { getInputs as gotoGetInputs } from './YtpcInputGoto.test';
import { getInputs as loopGetInputs } from './YtpcInputLoop.test';
import { getInputs as pauseGetInputs } from './YtpcInputPause.test';
import { getInputs as playbackRateGetInputs } from './YtpcInputPlaybackRate.test';
import { getInputs as threeSixtyGetInputs } from './YtpcInput360.test';
import { getInputs as volumeGetInputs } from './YtpcInputVolume.test';

import YtpcInput from './YtpcInput';
import { getControlTypes } from './YtpcControlSelect';

export interface YtpcInputInputs {
  nowTime: HTMLElement;
  atTime: HTMLInputElement;
  controlSelect: YtpcControlSelectInputs;
  controlInput: HTMLElement;
  add: YtpcAddInputs;
}

export function getInputs(container: HTMLElement): YtpcInputInputs {
  return {
    nowTime: container.querySelector('.now-time')!,
    atTime: container.querySelector('.at-time')!.getElementsByTagName('input')[0],
    controlSelect: controlSelectGetInputs(container.querySelector('.control-select')!),
    controlInput: container.querySelector('.control-input')!,
    add: addGetInputs(container.querySelector('.add')!),
  };
}

export function getInputsByControl(container: HTMLElement, type: ControlType): any {
  let inputs;

  switch (type) {
    case ControlType.Goto:
      inputs = gotoGetInputs(container);
      break;
    case ControlType.Loop:
      inputs = loopGetInputs(container);
      break;
    case ControlType.Pause:
      inputs = pauseGetInputs(container);
      break;
    case ControlType.PlaybackRate:
      inputs = playbackRateGetInputs(container);
      break;
    case ControlType.ThreeSixty:
      inputs = threeSixtyGetInputs(container);
      break;
    case ControlType.Volume:
      inputs = volumeGetInputs(container);
      break;
    default:
      inputs = null;
      break;
  }

  if (inputs) {
    for (const [key, value] of Object.entries(inputs)) {
      if (!value) {
        return null;
      }
    }
  }

  return inputs;
}

describe('YtpcInput', () => {
  it.each(
    getControlTypes().map(([type, control]) => [type, control.name]) as [ControlType, string][],
  )(
    'renders the %s input element from control select',
    (controlType: ControlType, expected: string) => {
      const defaultState: YtpcGotoState = {
        atTime: 0,
        controlType,
        gotoTime: 0,
      };
      const setDefaultState = jest.fn();
      const setEntryState = jest.fn();
      const createEntry = jest.fn();

      const { container } = render(<YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={defaultState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);

      const { controlInput } = getInputs(container);

      const fiberNode = getFiberNode(controlInput);

      expect(getNameFromFiberNode(fiberNode.child)).toEqual(expected);
    },
  );

  it('sets the atTime', () => {
    let defaultState: YtpcGotoState = {
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    };
    let entryState: YtpcGotoState = { ...defaultState };

    const createEntry = jest.fn();

    const { container, rerender } = render(<div />);

    const setDefaultState = jest.fn((state) => {
      defaultState = state;
      rerender(<YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={entryState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);
    });
    const setEntryState = jest.fn((state) => {
      entryState = state;
      rerender(<YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={entryState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);
    });

    rerender(<YtpcInput
      is360Video={false}
      defaultState={defaultState}
      setDefaultState={setDefaultState}
      entryState={entryState}
      setEntryState={setEntryState}
      createEntry={createEntry}
    />);

    const { atTime } = getInputs(container);

    userEvent.clear(atTime);
    userEvent.type(atTime, '1:23');
    fireEvent.blur(atTime);

    expect(atTime.value).toEqual('01:23');
    expect(entryState).toEqual({
      atTime: 83,
      controlType: ControlType.Goto,
      gotoTime: 0,
    });
  });

  it('sets the atTime to time in video', () => {
    let defaultState: YtpcGotoState = {
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    };

    const setEntryState = jest.fn();
    const createEntry = jest.fn();

    const ytPlayer = {
      getCurrentTime: jest.fn(() => 123.456),
      getAvailablePlaybackRates: jest.fn(() => [1]),
    } as unknown as YouTubePlayer;

    const { container, rerender } = render(<div />);

    const setDefaultState = jest.fn((state) => {
      defaultState = state;
      rerender(<YtpcInput
        ytPlayer={ytPlayer}
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={defaultState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);
    });

    rerender(<YtpcInput
      ytPlayer={ytPlayer}
      is360Video={false}
      defaultState={defaultState}
      setDefaultState={setDefaultState}
      entryState={defaultState}
      setEntryState={setEntryState}
      createEntry={createEntry}
    />);

    const {
      nowTime,
      atTime,
    } = getInputs(container);

    userEvent.click(nowTime);

    expect(atTime.value).toEqual('02:03.46');
  });

  it('adds an entry', () => {
    let defaultState: YtpcGotoState = {
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    };
    let entryState: YtpcGotoState = { ...defaultState };

    const { container, rerender } = render(<div />);

    const createEntry = jest.fn();
    const setDefaultState = jest.fn((state) => {
      defaultState = state;
      rerender(<YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={entryState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);
    });
    const setEntryState = jest.fn((state) => {
      entryState = state;
      rerender(<YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={entryState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);
    });

    rerender(<YtpcInput
      is360Video={false}
      defaultState={defaultState}
      setDefaultState={setDefaultState}
      entryState={entryState}
      setEntryState={setEntryState}
      createEntry={createEntry}
    />);

    const {
      atTime,
      controlSelect,
      controlInput,
      add,
    } = getInputs(container);

    userEvent.clear(atTime);
    userEvent.type(atTime, '1:23');

    userEvent.selectOptions(controlSelect.select, ControlType.Loop);

    const { loopBackTo } = loopGetInputs(controlInput);

    userEvent.clear(loopBackTo);
    userEvent.type(loopBackTo, '23');

    userEvent.click(add.add);

    expect(createEntry).toHaveBeenCalledWith({
      atTime: 83,
      controlType: ControlType.Loop,
      loopBackTo: 23,
      loopCount: -1,
    });
  });
});
