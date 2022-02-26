import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { Ytpc360State } from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcInput360, { LERP_TIME_DEFAULT } from './YtpcInput360';

function getInputs(container: HTMLElement): ({
  yaw: HTMLInputElement,
  pitch: HTMLInputElement,
  roll: HTMLInputElement,
  fov: HTMLInputElement,
  lerp: HTMLInputElement,
  lerpSeconds: HTMLInputElement,
}) {
  return {
    yaw: container.querySelector('.yaw')!.getElementsByTagName('input')[0],
    pitch: container.querySelector('.pitch')!.getElementsByTagName('input')[0],
    roll: container.querySelector('.roll')!.getElementsByTagName('input')[0],
    fov: container.querySelector('.fov')!.getElementsByTagName('input')[0],
    lerp: container.querySelector('.lerp')!.getElementsByTagName('input')[0],
    lerpSeconds: container.querySelector('.lerp-seconds')!.getElementsByTagName('input')[0],
  };
}

describe('YtpcInput360', () => {
  it('updates entry state', () => {
    const state: Ytpc360State = {
      atTime: 0,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 0,
        pitch: 0,
        roll: 0,
        fov: 100,
      },
      lerpSeconds: -1,
    };
    const setEntryState = jest.fn();

    const { container } = render(<YtpcInput360
      defaultState={state}
      setEntryState={setEntryState}
    />);

    const {
      yaw,
      pitch,
      roll,
      fov,
      lerp,
      lerpSeconds,
    } = getInputs(container);

    userEvent.clear(yaw);
    userEvent.type(yaw, '1');

    userEvent.clear(pitch);
    userEvent.type(pitch, '2');

    userEvent.clear(roll);
    userEvent.type(roll, '3');

    userEvent.clear(fov);
    userEvent.type(fov, '110');

    userEvent.click(lerp);

    expect(lerpSeconds.value).toEqual(LERP_TIME_DEFAULT.toString());

    userEvent.clear(lerpSeconds);
    userEvent.type(lerpSeconds, '5');

    const { calls } = setEntryState.mock;
    expect(calls[calls.length - 1][0]).toEqual({
      atTime: 0,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 1,
        pitch: 2,
        roll: 3,
        fov: 110,
      },
      lerpSeconds: 5,
    });
  });

  it('updates values on prop changes', () => {
    let state: Ytpc360State = {
      atTime: 0,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 0,
        pitch: 0,
        roll: 0,
        fov: 100,
      },
      lerpSeconds: -1,
    };
    const setEntryState = jest.fn();

    const { container, rerender } = render(<YtpcInput360
      defaultState={state}
      setEntryState={setEntryState}
    />);

    const {
      yaw,
      pitch,
      roll,
      fov,
      lerp,
      lerpSeconds,
    } = getInputs(container);

    expect(yaw.value).toEqual(state.sphereProps.yaw.toString());
    expect(pitch.value).toEqual(state.sphereProps.pitch.toString());
    expect(roll.value).toEqual(state.sphereProps.roll.toString());
    expect(fov.value).toEqual(state.sphereProps.fov.toString());
    expect(lerp.checked).toEqual((state.lerpSeconds ?? -1) >= 0);
    expect(lerpSeconds.value).toEqual(LERP_TIME_DEFAULT.toString());

    state = {
      atTime: 0,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 1,
        pitch: 2,
        roll: 3,
        fov: 110,
      },
      lerpSeconds: 5,
    };

    rerender(<YtpcInput360
      defaultState={state}
      setEntryState={setEntryState}
    />);

    expect(yaw.value).toEqual(state.sphereProps.yaw.toString());
    expect(pitch.value).toEqual(state.sphereProps.pitch.toString());
    expect(roll.value).toEqual(state.sphereProps.roll.toString());
    expect(fov.value).toEqual(state.sphereProps.fov.toString());
    expect(lerp.checked).toEqual((state.lerpSeconds ?? -1) >= 0);
    expect(lerpSeconds.value).toEqual((state.lerpSeconds ?? -1).toString());
  });
});
