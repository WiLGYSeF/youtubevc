import { ControlType } from './YouTubePlayerControllerEntry';
import Ytpc360Entry, { SphericalProperties, YouTubePlayer360, Ytpc360State } from './Ytpc360Entry';
import Coroutine from '../../utils/coroutine';

describe('Ytpc360Entry', () => {
  it('sets the spherical properties', () => {
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

    const getSphericalProperties = jest.fn(() => ({
      yaw: 0,
      pitch: 0,
      roll: 0,
      fov: 100,
    })) as jest.MockedFunction<YouTubePlayer360['getSphericalProperties']>;
    const setSphericalProperties = jest.fn() as jest.MockedFunction<YouTubePlayer360['setSphericalProperties']>;
    const ytPlayer = jest.fn(() => ({
      getSphericalProperties,
      setSphericalProperties,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer360);

    expect(setSphericalProperties).lastCalledWith(entry.sphereProps);
  });

  it('sets the spherical properties over time', () => {
    const startMock = jest.spyOn(Coroutine.prototype, 'start').mockImplementation(() => {});

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

    const getSphericalProperties = jest.fn(() => ({
      ...spherePropStart,
    })) as jest.MockedFunction<YouTubePlayer360['getSphericalProperties']>;
    const setSphericalProperties = jest.fn() as jest.MockedFunction<YouTubePlayer360['setSphericalProperties']>;
    const ytPlayer = jest.fn(() => ({
      getSphericalProperties,
      setSphericalProperties,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer360);

    // find the coroutine instance from the mocked call
    const routine = startMock.mock.instances[0] as unknown as Coroutine;
    // pretend half the time has passed
    routine.callback((entry.lerpSeconds / 2) * 1000);

    expect(getSphericalProperties).toBeCalledTimes(1);

    const lastCallSphereProps = setSphericalProperties.mock.calls[0][0];
    for (const key of Object.keys(entry.sphereProps) as (keyof SphericalProperties)[]) {
      const expected = Math.round((spherePropStart[key] + spherePropEnd[key]) / 2);
      expect(Math.round(lastCallSphereProps[key])).toBeGreaterThanOrEqual(expected - 1);
      expect(Math.round(lastCallSphereProps[key])).toBeLessThanOrEqual(expected + 1);
    }
    startMock.mockRestore();
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
        expect(result?.getState()).toStrictEqual(expected);
      } else {
        expect(result).toBe(expected);
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
        expect(Ytpc360Entry.fromState(state).toString()).toBe(expected);
      } else {
        expect(() => Ytpc360Entry.fromState(state)).toThrow();
      }
    },
  );
});
