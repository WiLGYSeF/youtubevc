import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcVolumeEntry, { YtpcVolumeState } from './YtpcVolumeEntry';
import Coroutine from '../../utils/coroutine';

describe('YtpcVolumeEntry', () => {
  it('sets the volume', () => {
    const entry = YtpcVolumeEntry.fromState({
      atTime: 101,
      controlType: ControlType.Volume,
      volume: 50,
      lerpSeconds: -1,
    });

    const setVolume = jest.fn() as jest.MockedFunction<YouTubePlayer['setVolume']>;
    const ytPlayer = jest.fn(() => ({
      setVolume,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer, 0);

    expect(setVolume).toBeCalledTimes(1);
    expect(setVolume).lastCalledWith(entry.volume);
  });

  it('sets the volume over time', () => {
    const startMock = jest.spyOn(Coroutine.prototype, 'start').mockImplementation(() => {});

    const volumeStart = 100;
    const volumeEnd = 50;

    const entry = YtpcVolumeEntry.fromState({
      atTime: 101,
      controlType: ControlType.Volume,
      volume: volumeEnd,
      lerpSeconds: 3,
    });

    const getVolume = jest.fn(() => volumeStart) as jest.MockedFunction<YouTubePlayer['getVolume']>;
    const setVolume = jest.fn() as jest.MockedFunction<YouTubePlayer['setVolume']>;
    const ytPlayer = jest.fn(() => ({
      getVolume,
      setVolume,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer, 0);

    // find the coroutine instance from the mocked call
    const routine = startMock.mock.instances[0] as unknown as Coroutine;
    // pretend half the time has passed
    routine.callback(entry.lerpSeconds / 2 * 1000);

    const lastCallVolume = setVolume.mock.calls[0][0];
    expect(Math.round(lastCallVolume))
      .toBeCloseTo(Math.round((volumeStart + volumeEnd) / 2));
    startMock.mockRestore();
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
        expect(YtpcVolumeEntry.fromState(state).toString()).toBe(expected);
      } else {
        expect(() => YtpcVolumeEntry.fromState(state)).toThrow();
      }
    },
  );
});
