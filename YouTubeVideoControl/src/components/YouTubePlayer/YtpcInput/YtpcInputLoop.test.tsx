import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcLoopState } from 'objects/YtpcEntry/YtpcLoopEntry';
import { secondsToTimestamp } from 'utils/timestr';
import YtpcInputLoop from './YtpcInputLoop';
import { getInputs as checkboxGetInputs, CheckboxInputs } from '../../common/Checkbox/Checkbox.test';
import { getInputs as numberGetInputs, NumberInputInputs } from '../../common/NumberInput/NumberInput.test';
import { getInputs as timestampGetInputs, TimestampInputsInput } from '../../common/TimestampInput/TimestampInput.test';

export interface YtpcInputLoopInputs {
  loopBackTo: TimestampInputsInput;
  forever: CheckboxInputs;
  loopCount: NumberInputInputs;
}

export function getInputs(container: HTMLElement): YtpcInputLoopInputs {
  return {
    loopBackTo: timestampGetInputs(container.querySelector('[data-testid="loop-back-to"]')!),
    forever: checkboxGetInputs(container.querySelector('[data-testid="forever"]')!),
    loopCount: numberGetInputs(container.querySelector('.loop-count')!),
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

    userEvent.clear(loopBackTo.input);
    userEvent.type(loopBackTo.input, '12:34');

    userEvent.click(forever.checkbox);

    userEvent.clear(loopCount.input);
    userEvent.type(loopCount.input, '3');

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

    expect(loopBackTo.input.value).toEqual(secondsToTimestamp(state.loopBackTo));
    expect(forever.checkbox.checked).toEqual((state.loopCount ?? -1) < 0);
    expect(loopCount.input.value).toEqual(state.loopCount.toString());

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

    expect(loopBackTo.input.value).toEqual(secondsToTimestamp(state.loopBackTo));
    expect(forever.checkbox.checked).toEqual((state.loopCount ?? -1) < 0);
    expect(loopCount.input.value).toEqual(state.loopCount.toString());
  });
});
