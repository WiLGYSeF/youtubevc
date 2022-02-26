import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcGotoState } from 'objects/YtpcEntry/YtpcGotoEntry';
import { getFiberNode, getNameFromFiberNode } from 'utils/test/fiberNode';
import { getInputs as addGetInputs } from '../YtpcAdd.test';
import { getInputs as controlSelectGetInputs } from './YtpcControlSelect.test';
import { getInputs as loopGetInputs } from './YtpcInputLoop.test';

import YtpcInput from './YtpcInput';
import { getControlTypes } from './YtpcControlSelect';

export function getInputs(container: HTMLElement): ({
  nowTime: HTMLElement,
  atTime: HTMLInputElement,
  controlSelect: HTMLElement,
  controlInput: HTMLElement,
  add: HTMLElement,
}) {
  return {
    nowTime: container.querySelector('.now-time')!,
    atTime: container.querySelector('.at-time')!.getElementsByTagName('input')[0],
    controlSelect: container.querySelector('.control-select')!,
    controlInput: container.querySelector('.control-input')!,
    add: container.querySelector('.add')!,
  };
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

    let rendered = false;

    const setDefaultState = jest.fn((state) => {
      defaultState = state;
      rendered && rerender(component);
    });
    const setEntryState = jest.fn((state) => {
      entryState = state;
      rendered && rerender(component);
    });
    const createEntry = jest.fn();

    const component = (
      <YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={entryState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />
    );

    const { container, rerender } = render(component);
    rendered = true;

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
    const setEntryState = jest.fn();
    const createEntry = jest.fn();

    const ytPlayer = {
      getCurrentTime: jest.fn(() => 123.456),
      getAvailablePlaybackRates: jest.fn(() => [1]),
    } as unknown as YouTubePlayer;

    const { container, rerender } = render(<YtpcInput
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

    let rendered = false;

    const setDefaultState = jest.fn((state) => {
      defaultState = state;
      rendered && rerender(<YtpcInput
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
      rendered && rerender(<YtpcInput
        is360Video={false}
        defaultState={defaultState}
        setDefaultState={setDefaultState}
        entryState={entryState}
        setEntryState={setEntryState}
        createEntry={createEntry}
      />);
    });
    const createEntry = jest.fn();

    const { container, rerender } = render(<YtpcInput
      is360Video={false}
      defaultState={defaultState}
      setDefaultState={setDefaultState}
      entryState={entryState}
      setEntryState={setEntryState}
      createEntry={createEntry}
    />);
    rendered = true;

    const {
      atTime,
      controlSelect,
      controlInput,
      add,
    } = getInputs(container);

    userEvent.clear(atTime);
    userEvent.type(atTime, '1:23');

    const { select: controlSelectSelect } = controlSelectGetInputs(controlSelect);

    userEvent.selectOptions(controlSelectSelect, ControlType.Loop);

    const { loopBackTo } = loopGetInputs(controlInput);

    userEvent.clear(loopBackTo);
    userEvent.type(loopBackTo, '23');

    const { add: addAdd } = addGetInputs(add);

    userEvent.click(addAdd);

    expect(createEntry).toHaveBeenCalledWith({
      atTime: 83,
      controlType: ControlType.Loop,
      loopBackTo: 23,
      loopCount: -1,
    });
  });
});
