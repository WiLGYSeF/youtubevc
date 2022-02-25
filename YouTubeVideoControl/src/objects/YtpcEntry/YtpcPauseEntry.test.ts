import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine from 'utils/coroutine';
import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcPauseEntry, { YtpcPauseState } from './YtpcPauseEntry';

function mockPause(
  fn: (
    mocks: {
      pauseVideo: jest.Mock,
      playVideo: jest.Mock,
      ytPlayer: jest.Mock,
    },
    getRoutine: () => Coroutine,
  ) => void
): void {
  const startMock = jest.spyOn(Coroutine.prototype, 'start').mockImplementation(() => { });

  const pauseVideo = jest.fn();
  const playVideo = jest.fn();

  fn(
    {
      pauseVideo,
      playVideo,
      ytPlayer: jest.fn(() => ({
        pauseVideo,
        playVideo,
      })),
    },
    // find the coroutine instance from the mocked call
    () => startMock.mock.instances[0] as unknown as Coroutine,
  );

  startMock.mockRestore();
}

describe('YtpcPauseEntry', () => {
  it('pauses video', () => {
    const entry = YtpcPauseEntry.fromState({
      atTime: 101,
      controlType: ControlType.Pause,
      pauseTime: 5,
    });

    mockPause(({ pauseVideo, playVideo, ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);

      const routine = getRoutine();

      routine.callback(entry.pauseTime * 1000 - 10);
      expect(pauseVideo).toBeCalledTimes(1);
      expect(playVideo).toBeCalledTimes(0);

      routine.callback(entry.pauseTime * 1000);
      expect(pauseVideo).toBeCalledTimes(1);
      expect(playVideo).toBeCalledTimes(1);
    });
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
        expect(result).toEqual(expected);
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
        expect(YtpcPauseEntry.fromState(state).toString()).toEqual(expected);
      } else {
        expect(() => YtpcPauseEntry.fromState(state)).toThrow();
      }
    },
  );

  it('restores state', () => {
    const entry = YtpcPauseEntry.fromState({
      atTime: 101,
      controlType: ControlType.Pause,
      pauseTime: 5,
    });

    mockPause(({ pauseVideo, playVideo, ytPlayer }, getRoutine) => {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);

      const routine = getRoutine();

      routine.callback(entry.pauseTime * 1000 - 10);
      expect(pauseVideo).toBeCalledTimes(1);
      expect(playVideo).toBeCalledTimes(0);

      entry.restoreState();
      expect(routine.stopped).toBeTruthy();
      expect(playVideo).toBeCalledTimes(1);
    });
  });
});
