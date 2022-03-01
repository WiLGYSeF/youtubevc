import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { Ytpc360State } from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcInput360, { getInputs, LERP_TIME_DEFAULT } from './YtpcInput360';

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
      entryState={state}
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

    userEvent.clear(yaw.input);
    userEvent.type(yaw.input, '1');

    userEvent.clear(pitch.input);
    userEvent.type(pitch.input, '2');

    userEvent.clear(roll.input);
    userEvent.type(roll.input, '3');

    userEvent.clear(fov.input);
    userEvent.type(fov.input, '110');

    userEvent.click(lerp.checkbox);

    expect(lerpSeconds.input.value).toEqual(LERP_TIME_DEFAULT.toString());

    userEvent.clear(lerpSeconds.input);
    userEvent.type(lerpSeconds.input, '5');

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
      entryState={state}
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

    expect(yaw.input.value).toEqual(state.sphereProps.yaw.toString());
    expect(pitch.input.value).toEqual(state.sphereProps.pitch.toString());
    expect(roll.input.value).toEqual(state.sphereProps.roll.toString());
    expect(fov.input.value).toEqual(state.sphereProps.fov.toString());
    expect(lerp.checkbox.checked).toEqual((state.lerpSeconds ?? -1) >= 0);
    expect(lerpSeconds.input.value).toEqual(LERP_TIME_DEFAULT.toString());

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
      entryState={state}
      setEntryState={setEntryState}
    />);

    expect(yaw.input.value).toEqual(state.sphereProps.yaw.toString());
    expect(pitch.input.value).toEqual(state.sphereProps.pitch.toString());
    expect(roll.input.value).toEqual(state.sphereProps.roll.toString());
    expect(fov.input.value).toEqual(state.sphereProps.fov.toString());
    expect(lerp.checkbox.checked).toEqual((state.lerpSeconds ?? -1) >= 0);
    expect(lerpSeconds.input.value).toEqual((state.lerpSeconds ?? -1).toString());
  });
});
