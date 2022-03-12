import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcLoopState } from 'objects/YtpcEntry/YtpcLoopEntry';
import mockI18n from 'utils/test/i18nMock';
import { secondsToTimestamp } from 'utils/timestr';
import YtpcInputLoop, { getInputs } from './YtpcInputLoop';

jest.mock('react-i18next', () => mockI18n());

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
    expect(loopCount.input.value).toEqual(Math.max(state.loopCount, 0).toString());

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
