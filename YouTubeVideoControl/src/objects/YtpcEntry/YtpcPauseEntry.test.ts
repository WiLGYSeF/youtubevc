import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine from 'utils/coroutine';
import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcPauseEntry, { YtpcPauseState } from './YtpcPauseEntry';

describe('YtpcPauseEntry', () => {
  it('pauses video', () => {
    const startMock = jest.spyOn(Coroutine.prototype, 'start').mockImplementation(() => {});

    const entry = YtpcPauseEntry.fromState({
      atTime: 101,
      controlType: ControlType.Pause,
      pauseTime: 5,
    });

    const pauseVideo = jest.fn() as jest.MockedFunction<YouTubePlayer['pauseVideo']>;
    const playVideo = jest.fn() as jest.MockedFunction<YouTubePlayer['playVideo']>;
    const ytPlayer = jest.fn(() => ({
      pauseVideo,
      playVideo,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer);

    // find the coroutine instance from the mocked call
    const routine = startMock.mock.instances[0] as unknown as Coroutine;
    routine.callback(entry.pauseTime * 1000 - 10);

    expect(pauseVideo).toBeCalledTimes(1);
    expect(playVideo).toBeCalledTimes(0);

    routine.callback(entry.pauseTime * 1000);
    expect(pauseVideo).toBeCalledTimes(1);
    expect(playVideo).toBeCalledTimes(1);
    startMock.mockRestore();
  });

  it.each([
    ['At 9:45, pause for 3 seconds', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Pause,
      pauseTime: 3,
    }],
    ['At 9:45, pause for 2m 3s', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Pause,
      pauseTime: 2 * 60 + 3,
    }],
    ['Aaaa', null],
  ])(
    'creates from string "%s"',
    (str: string, expected: YtpcPauseState | null) => {
      const result = YtpcPauseEntry.fromString(str);
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
        controlType: ControlType.Pause,
        pauseTime: 4 * 60 + 33,
      },
      'At 01:03, pause for 4m 33s',
    ],
  ])(
    'creates string from %j',
    (state: YtpcPauseState, expected: string | null) => {
      if (expected) {
        expect(YtpcPauseEntry.fromState(state).toString()).toBe(expected);
      } else {
        expect(() => YtpcPauseEntry.fromState(state)).toThrow();
      }
    },
  );
});
