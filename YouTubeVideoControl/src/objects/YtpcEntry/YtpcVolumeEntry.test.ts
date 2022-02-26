import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine from 'utils/coroutine';
import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcVolumeEntry, { YtpcVolumeState } from './YtpcVolumeEntry';

function mockVolume(
  volumeStart: number,
  fn: (
    mocks: {
      getVolume: jest.Mock,
      setVolume: jest.Mock,
      ytPlayer: jest.Mock,
    },
    getRoutine: () => Coroutine,
  ) => void,
): void {
  const startMock = jest.spyOn(Coroutine.prototype, 'start').mockImplementation(() => {});

  const getVolume = jest.fn(() => volumeStart);
  const setVolume = jest.fn();

  fn(
    {
      getVolume,
      setVolume,
      ytPlayer: jest.fn(() => ({
        getVolume,
        setVolume,
      })),
    },
    // find the coroutine instance from the mocked call
    () => startMock.mock.instances[0] as unknown as Coroutine,
  );

  startMock.mockRestore();
}

describe('YtpcVolumeEntry', () => {
  it('sets the volume', () => {
    const entry = YtpcVolumeEntry.fromState({
      atTime: 101,
      controlType: ControlType.Volume,
      volume: 50,
      lerpSeconds: -1,
    });

    mockVolume(100, ({ setVolume, ytPlayer }) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);

      expect(setVolume).toBeCalledTimes(1);
      expect(setVolume).lastCalledWith(entry.volume);
    });
  });

  it('sets the volume over time', () => {
    const volumeStart = 100;
    const volumeEnd = 50;

    const entry = YtpcVolumeEntry.fromState({
      atTime: 101,
      controlType: ControlType.Volume,
      volume: volumeEnd,
      lerpSeconds: 3,
    });

    mockVolume(volumeStart, ({ setVolume, ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);

      const routine = getRoutine();
      // pretend half the time has passed
      routine.callback((entry.lerpSeconds / 2) * 1000);

      const lastCallVolume = setVolume.mock.calls[0][0];
      expect(Math.round(lastCallVolume))
        .toBeCloseTo(Math.round((volumeStart + volumeEnd) / 2));
    });
  });

  it('ensures volume is set at end of routine', () => {
    const volumeStart = 100;
    const volumeEnd = 50;

    const entry = YtpcVolumeEntry.fromState({
      atTime: 101,
      controlType: ControlType.Volume,
      volume: volumeEnd,
      lerpSeconds: 3,
    });

    mockVolume(volumeStart, ({ setVolume, ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);

      const routine = getRoutine();
      routine.callback(entry.lerpSeconds * 1000 - 10);
      routine.stop();

      expect(setVolume).toHaveBeenLastCalledWith(entry.volume);
    });
  });

  it.each([
    ['At 9:45, set volume to 34', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Volume,
      volume: 34,
      lerpSeconds: -1,
    }],
    ['At 9:45, set volume to 34 during the next 3 seconds', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Volume,
      volume: 34,
      lerpSeconds: 3,
    }],
    ['Aaaa', null],
  ])(
    'creates from string "%s"',
    (str: string, expected: YtpcVolumeState | null) => {
      const result = YtpcVolumeEntry.fromString(str);
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
        controlType: ControlType.Volume,
        volume: 34,
        lerpSeconds: -1,
      },
      'At 01:03, set volume to 34',
    ],
    [
      {
        atTime: 60 + 3,
        controlType: ControlType.Volume,
        volume: 34,
        lerpSeconds: 5,
      },
      'At 01:03, set volume to 34 during the next 5 seconds',
    ],
  ])(
    'creates string from %j',
    (state: YtpcVolumeState, expected: string) => {
      if (expected) {
        expect(YtpcVolumeEntry.fromState(state).toString()).toEqual(expected);
      } else {
        expect(() => YtpcVolumeEntry.fromState(state)).toThrow();
      }
    },
  );

  it('restores state', () => {
    const volumeStart = 100;
    const volumeEnd = 50;

    const entry = YtpcVolumeEntry.fromState({
      atTime: 101,
      controlType: ControlType.Volume,
      volume: volumeEnd,
      lerpSeconds: 3,
    });

    mockVolume(volumeStart, ({ ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);
      entry.restoreState();

      const routine = getRoutine();
      expect(routine.stopped).toBeTruthy();
    });
  });
});
