import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcLoopState } from 'objects/YtpcEntry/YtpcLoopEntry';
import { secondsToTimestamp } from 'utils/timestr';
import YtpcInputLoop from './YtpcInputLoop';

export interface YtpcInputLoopInputs {
  loopBackTo: HTMLInputElement;
  forever: HTMLInputElement;
  loopCount: HTMLInputElement;
}

export function getInputs(container: HTMLElement): YtpcInputLoopInputs {
  return {
    loopBackTo: container.querySelector('.loop-back-to')!.getElementsByTagName('input')[0],
    forever: container.querySelector('.forever')!.getElementsByTagName('input')[0],
    loopCount: container.querySelector('.loop-count')!.getElementsByTagName('input')[0],
  };
}

describe('YtpcInputLoop', () => {
  it('updates entry state', () => {
    const state: YtpcLoopState = {
      atTime: 0,
      controlType: ControlType.Loop,
      loopBackTo: 0,
      loopCount: -1,
    };
    const setEntryState = jest.fn();

    const { container } = render(<YtpcInputLoop
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const {
      loopBackTo,
      forever,
      loopCount,
    } = getInputs(container);

    userEvent.clear(loopBackTo);
    userEvent.type(loopBackTo, '12:34');

    userEvent.click(forever);

    userEvent.clear(loopCount);
    userEvent.type(loopCount, '3');

    const { calls } = setEntryState.mock;
    expect(calls[calls.length - 1][0]).toEqual({
      atTime: 0,
      controlType: ControlType.Loop,
      loopBackTo: 12 * 60 + 34,
      loopCount: 3,
    });
  });

  it('updates values on prop changes', () => {
    let state: YtpcLoopState = {
      atTime: 0,
      controlType: ControlType.Loop,
      loopBackTo: 0,
      loopCount: -1,
    };
    const setEntryState = jest.fn();

    const { container, rerender } = render(<YtpcInputLoop
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const {
      loopBackTo,
      forever,
      loopCount,
    } = getInputs(container);

    expect(loopBackTo.value).toEqual(secondsToTimestamp(state.loopBackTo));
    expect(forever.checked).toEqual((state.loopCount ?? -1) < 0);
    expect(loopCount.value).toEqual(state.loopCount.toString());

    state = {
      atTime: 0,
      controlType: ControlType.Loop,
      loopBackTo: 123,
      loopCount: 4,
    };

    rerender(<YtpcInputLoop
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    expect(loopBackTo.value).toEqual(secondsToTimestamp(state.loopBackTo));
    expect(forever.checked).toEqual((state.loopCount ?? -1) < 0);
    expect(loopCount.value).toEqual(state.loopCount.toString());
  });
});
