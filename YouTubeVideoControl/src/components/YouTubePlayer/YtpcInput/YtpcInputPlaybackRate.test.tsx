import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcPlaybackRateState } from 'objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcInputPlaybackRate from './YtpcInputPlaybackRate';

export function getInputs(container: HTMLElement): ({
  playbackRate: HTMLSelectElement,
}) {
  return {
    playbackRate: container.querySelector('.playback-rate')!.getElementsByTagName('select')[0],
  };
}

describe('YtpcInputPlaybackRate', () => {
  it('updates entry state', () => {
    const state: YtpcPlaybackRateState = {
      atTime: 0,
      controlType: ControlType.PlaybackRate,
      playbackRate: 1,
    };
    const setEntryState = jest.fn();

    const { container } = render(<YtpcInputPlaybackRate
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
      playbackRates={[0.25, 0.5, 1, 1.25, 1.5, 2]}
    />);

    const { playbackRate } = getInputs(container);

    userEvent.selectOptions(playbackRate, '1.5');

    const { calls } = setEntryState.mock;
    expect(calls[calls.length - 1][0]).toEqual({
      atTime: 0,
      controlType: ControlType.PlaybackRate,
      playbackRate: 1.5,
    });
  });

  it('updates value on props change', () => {
    let state: YtpcPlaybackRateState = {
      atTime: 0,
      controlType: ControlType.PlaybackRate,
      playbackRate: 1,
    };
    const setEntryState = jest.fn();
    const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const { container, rerender } = render(<YtpcInputPlaybackRate
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
      playbackRates={playbackRates}
    />);

    const { playbackRate } = getInputs(container);

    expect(playbackRate.value).toEqual(state.playbackRate.toString());

    state = {
      atTime: 0,
      controlType: ControlType.PlaybackRate,
      playbackRate: 1.5,
    };

    rerender(<YtpcInputPlaybackRate
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
      playbackRates={playbackRates}
    />);

    expect(playbackRate.value).toEqual(state.playbackRate.toString());
  });
});
