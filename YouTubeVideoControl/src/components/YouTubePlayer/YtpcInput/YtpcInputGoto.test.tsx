import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcGotoState } from 'objects/YtpcEntry/YtpcGotoEntry';
import { secondsToTimestamp } from 'utils/timestr';
import YtpcInputGoto from './YtpcInputGoto';

export function getInputs(container: HTMLElement): ({
  gotoTime: HTMLInputElement,
}) {
  return {
    gotoTime: container.getElementsByTagName('input')[0],
  };
}

describe('YtpcInputGoto', () => {
  it('updates entry state', () => {
    const state: YtpcGotoState = {
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    };
    const setEntryState = jest.fn();

    const { container } = render(<YtpcInputGoto
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const { gotoTime } = getInputs(container);

    userEvent.clear(gotoTime);
    userEvent.type(gotoTime, '12:34');

    const { calls } = setEntryState.mock;
    expect(calls[calls.length - 1][0]).toEqual({
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 12 * 60 + 34,
    });
  });

  it('updates value on props change', () => {
    let state: YtpcGotoState = {
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    };
    const setEntryState = jest.fn();

    const { container, rerender } = render(<YtpcInputGoto
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const { gotoTime } = getInputs(container);

    expect(gotoTime.value).toEqual(secondsToTimestamp(state.gotoTime));

    state = {
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 123,
    };

    rerender(<YtpcInputGoto
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    expect(gotoTime.value).toEqual(secondsToTimestamp(state.gotoTime));
  });
});
