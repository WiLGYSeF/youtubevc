import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcPauseState } from 'objects/YtpcEntry/YtpcPauseEntry';
import { secondsToTimestamp } from 'utils/timestr';
import YtpcInputPause, { getInputs } from './YtpcInputPause';

describe('YtpcInputPause', () => {
  it('updates entry state', () => {
    const state: YtpcPauseState = {
      atTime: 0,
      controlType: ControlType.Pause,
      pauseTime: 0,
    };
    const setEntryState = jest.fn();

    const { container } = render(<YtpcInputPause
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const { pauseTime } = getInputs(container);

    userEvent.clear(pauseTime.input);
    userEvent.type(pauseTime.input, '12:34');

    const { calls } = setEntryState.mock;
    expect(calls[calls.length - 1][0]).toEqual({
      atTime: 0,
      controlType: ControlType.Pause,
      pauseTime: 12 * 60 + 34,
    });
  });

  it('updates value on props change', () => {
    let state: YtpcPauseState = {
      atTime: 0,
      controlType: ControlType.Pause,
      pauseTime: 0,
    };
    const setEntryState = jest.fn();

    const { container, rerender } = render(<YtpcInputPause
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const { pauseTime } = getInputs(container);

    expect(pauseTime.input.value).toEqual(secondsToTimestamp(state.pauseTime));

    state = {
      atTime: 0,
      controlType: ControlType.Pause,
      pauseTime: 123,
    };

    rerender(<YtpcInputPause
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    expect(pauseTime.input.value).toEqual(secondsToTimestamp(state.pauseTime));
  });
});
