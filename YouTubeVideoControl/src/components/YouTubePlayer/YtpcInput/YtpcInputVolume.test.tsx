import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcVolumeState } from 'objects/YtpcEntry/YtpcVolumeEntry';
import YtpcInputVolume, { LERP_TIME_DEFAULT } from './YtpcInputVolume';

export function getInputs(container: HTMLElement): ({
  volume: HTMLInputElement,
  lerp: HTMLInputElement,
  lerpSeconds: HTMLInputElement,
}) {
  return {
    volume: container.querySelector('.volume')!.getElementsByTagName('input')[0],
    lerp: container.querySelector('.lerp')!.getElementsByTagName('input')[0],
    lerpSeconds: container.querySelector('.lerp-seconds')!.getElementsByTagName('input')[0],
  };
}

describe('YtpcInputVolume', () => {
  it('updates entry state', () => {
    const state: YtpcVolumeState = {
      atTime: 0,
      controlType: ControlType.Volume,
      volume: 100,
      lerpSeconds: -1,
    };
    const setEntryState = jest.fn();

    const { container } = render(<YtpcInputVolume
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const {
      volume,
      lerp,
      lerpSeconds,
    } = getInputs(container);

    fireEvent.change(volume, {
      target: {
        value: 50,
      },
    });

    userEvent.click(lerp);

    expect(lerpSeconds.value).toEqual(LERP_TIME_DEFAULT.toString());

    userEvent.clear(lerpSeconds);
    userEvent.type(lerpSeconds, '5');

    const { calls } = setEntryState.mock;
    expect(calls[calls.length - 1][0]).toEqual({
      atTime: 0,
      controlType: ControlType.Volume,
      volume: 50,
      lerpSeconds: 5,
    });
  });

  it('updates values on props change', () => {
    let state: YtpcVolumeState = {
      atTime: 0,
      controlType: ControlType.Volume,
      volume: 100,
      lerpSeconds: -1,
    };
    const setEntryState = jest.fn();

    const { container, rerender } = render(<YtpcInputVolume
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    const {
      volume,
      lerp,
      lerpSeconds,
    } = getInputs(container);

    expect(volume.value).toEqual(state.volume.toString());
    expect(lerp.checked).toEqual((state.lerpSeconds ?? -1) >= 0);
    expect(lerpSeconds.value).toEqual(LERP_TIME_DEFAULT.toString());

    state = {
      atTime: 0,
      controlType: ControlType.Volume,
      volume: 50,
      lerpSeconds: 4,
    };

    rerender(<YtpcInputVolume
      defaultState={state}
      entryState={state}
      setEntryState={setEntryState}
    />);

    expect(volume.value).toEqual(state.volume.toString());
    expect(lerp.checked).toEqual((state.lerpSeconds ?? -1) >= 0);
    expect(lerpSeconds.value).toEqual(state.lerpSeconds.toString());
  });
});
