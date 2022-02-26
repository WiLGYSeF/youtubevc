import Coroutine from 'utils/coroutine';
import { ControlType } from './YouTubePlayerControllerEntry';
import Ytpc360Entry, { SphericalProperties, YouTubePlayer360, Ytpc360State } from './Ytpc360Entry';

function mockSphericalProps(
  spherePropsStart: SphericalProperties,
  fn: (
    mocks: {
      getSphericalProperties: jest.Mock,
      setSphericalProperties: jest.Mock,
      ytPlayer: jest.Mock,
    },
    getRoutine: () => Coroutine,
  ) => void,
): void {
  const startMock = jest.spyOn(Coroutine.prototype, 'start').mockImplementation(() => { });

  const getSphericalProperties = jest.fn(() => spherePropsStart);
  const setSphericalProperties = jest.fn();

  fn(
    {
      getSphericalProperties,
      setSphericalProperties,
      ytPlayer: jest.fn(() => ({
        getSphericalProperties,
        setSphericalProperties,
      })),
    },
    // find the coroutine instance from the mocked call
    () => startMock.mock.instances[0] as unknown as Coroutine,
  );

  startMock.mockRestore();
}

describe('Ytpc360Entry', () => {
  it('sets the spherical properties', () => {
    const spherePropStart: SphericalProperties = {
      yaw: 0,
      pitch: 0,
      roll: 0,
      fov: 100,
    };

    const entry = Ytpc360Entry.fromState({
      atTime: 101,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 214,
        pitch: 23,
        roll: -61,
        fov: 90,
      },
      lerpSeconds: -1,
    });

    mockSphericalProps(spherePropStart, ({ setSphericalProperties, ytPlayer }) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer360);
      expect(setSphericalProperties).lastCalledWith(entry.sphereProps);
    });
  });

  it('sets the spherical properties over time', () => {
    const spherePropStart: SphericalProperties = {
      yaw: 0,
      pitch: 0,
      roll: 0,
      fov: 100,
    };
    const spherePropEnd: SphericalProperties = {
      yaw: 214,
      pitch: 23,
      roll: -61,
      fov: 90,
    };

    const entry = Ytpc360Entry.fromState({
      atTime: 101,
      controlType: ControlType.ThreeSixty,
      sphereProps: spherePropEnd,
      lerpSeconds: 3,
    });

    mockSphericalProps(spherePropStart, ({ getSphericalProperties, setSphericalProperties, ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer360);

      const routine = getRoutine();
      // pretend half the time has passed
      routine.callback((entry.lerpSeconds / 2) * 1000);

      expect(getSphericalProperties).toBeCalledTimes(1);

      const lastCallSphereProps = setSphericalProperties.mock.calls[0][0];
      for (const key of Object.keys(entry.sphereProps) as (keyof SphericalProperties)[]) {
        const expected = Math.round((spherePropStart[key] + spherePropEnd[key]) / 2);
        expect(Math.round(lastCallSphereProps[key])).toBeGreaterThanOrEqual(expected - 1);
        expect(Math.round(lastCallSphereProps[key])).toBeLessThanOrEqual(expected + 1);
      }
    });
  });

  it('ensures spherical properties are set at end of routine', () => {
    const spherePropStart: SphericalProperties = {
      yaw: 0,
      pitch: 0,
      roll: 0,
      fov: 100,
    };
    const spherePropEnd: SphericalProperties = {
      yaw: 214,
      pitch: 23,
      roll: -61,
      fov: 90,
    };

    const entry = Ytpc360Entry.fromState({
      atTime: 101,
      controlType: ControlType.ThreeSixty,
      sphereProps: spherePropEnd,
      lerpSeconds: 3,
    });

    mockSphericalProps(spherePropStart, ({ setSphericalProperties, ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer360);

      const routine = getRoutine();
      routine.callback(entry.lerpSeconds * 1000 - 10);
      routine.stop();

      expect(setSphericalProperties).toHaveBeenLastCalledWith(entry.sphereProps);
    });
  });

  it.each([
    ['At 9:45, set 360° view to yaw 1, pitch 2, roll 3, fov 90', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 1,
        pitch: 2,
        roll: 3,
        fov: 90,
      },
      lerpSeconds: -1,
    }],
    ['At 9:45, set 360° view to yaw 1, pitch 2, roll 3, fov 90 during the next 3 seconds', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 1,
        pitch: 2,
        roll: 3,
        fov: 90,
      },
      lerpSeconds: 3,
    }],
    ['At 9:45, set 360° view to pitch 2, fov 90 during the next 3 seconds', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.ThreeSixty,
      sphereProps: {
        yaw: 0,
        pitch: 2,
        roll: 0,
        fov: 90,
      },
      lerpSeconds: 3,
    }],
    ['Aaaa', null],
  ])(
    'creates from string "%s"',
    (str: string, expected: Ytpc360State | null) => {
      const result = Ytpc360Entry.fromString(str);
      if (expected) {
        expect(result?.getState()).toEqual(expected);
      } else {
        expect(result).toEqual(expected);
      }
    },
  );

  it.each([
    [
      {
        atTime: 60 + 3,
        controlType: ControlType.ThreeSixty,
        sphereProps: {
          yaw: 1,
          pitch: 2,
          roll: 3,
          fov: 90,
        },
        lerpSeconds: -1,
      },
      'At 01:03, set 360° view to yaw 1, pitch 2, roll 3, fov 90',
    ],
    [
      {
        atTime: 60 + 3,
        controlType: ControlType.ThreeSixty,
        sphereProps: {
          yaw: 1,
          pitch: 2,
          roll: 3,
          fov: 90,
        },
        lerpSeconds: 3,
      },
      'At 01:03, set 360° view to yaw 1, pitch 2, roll 3, fov 90 during the next 3 seconds',
    ],
  ])(
    'creates string from %j',
    (state: Ytpc360State, expected: string) => {
      if (expected) {
        expect(Ytpc360Entry.fromState(state).toString()).toEqual(expected);
      } else {
        expect(() => Ytpc360Entry.fromState(state)).toThrow();
      }
    },
  );

  it('restores state', () => {
    const spherePropStart: SphericalProperties = {
      yaw: 0,
      pitch: 0,
      roll: 0,
      fov: 100,
    };
    const spherePropEnd: SphericalProperties = {
      yaw: 214,
      pitch: 23,
      roll: -61,
      fov: 90,
    };

    const entry = Ytpc360Entry.fromState({
      atTime: 101,
      controlType: ControlType.ThreeSixty,
      sphereProps: spherePropEnd,
      lerpSeconds: 3,
    });

    mockSphericalProps(spherePropStart, ({ ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer360);
      entry.restoreState();

      const routine = getRoutine();

      expect(routine.stopped).toBeTruthy();
    });
  });
});
