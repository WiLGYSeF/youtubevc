import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcLoopEntry, { YtpcLoopState } from './YtpcLoopEntry';

describe('YtpcLoopEntry', () => {
  it('loops back', () => {
    const entry = YtpcLoopEntry.fromState({
      atTime: 101,
      controlType: ControlType.Loop,
      loopBackTo: 52,
      loopCount: -1,
    });

    const seekTo = jest.fn() as jest.MockedFunction<YouTubePlayer['seekTo']>;
    const ytPlayer = jest.fn(() => ({
      seekTo,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer, 0);

    expect(seekTo).toBeCalledTimes(1);
    expect(seekTo).lastCalledWith(entry.loopBackTo, true);
  });

  it('loops back up to count', () => {
    const entry = YtpcLoopEntry.fromState({
      atTime: 101,
      controlType: ControlType.Loop,
      loopBackTo: 52,
      loopCount: 3,
    });

    const seekTo = jest.fn() as jest.MockedFunction<YouTubePlayer['seekTo']>;
    const ytPlayer = jest.fn(() => ({
      seekTo,
    }));

    for (let i = 0; i < entry.loopCount + 2; i += 1) {
      entry.performAction(ytPlayer() as unknown as YouTubePlayer, 0);
    }

    expect(seekTo).toBeCalledTimes(entry.loopCount);
  });

  it.each([
    ['At 9:45, loop back to 3:07 forever', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Loop,
      loopBackTo: 3 * 60 + 7,
      loopCount: -1,
    }],
    ['At 9:45, loop back to 3:07 3 times', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Loop,
      loopBackTo: 3 * 60 + 7,
      loopCount: 3,
    }],
    ['At 9:45, loop back to 3:07', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.Loop,
      loopBackTo: 3 * 60 + 7,
      loopCount: -1,
    }],
    ['At 00:00, loop back to 3:07 forever', null],
    ['Aaaa', null],
  ])(
    'creates from string "%s"',
    (str: string, expected: YtpcLoopState | null) => {
      const result = YtpcLoopEntry.fromString(str);
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
        controlType: ControlType.Loop,
        loopBackTo: 24,
        loopCount: -1,
      },
      'At 01:03, loop back to 00:24 forever',
    ],
    [
      {
        atTime: 60 + 3,
        controlType: ControlType.Loop,
        loopBackTo: 24,
        loopCount: 5,
      },
      'At 01:03, loop back to 00:24 5 times',
    ],
    [
      {
        atTime: 60 + 3,
        controlType: ControlType.Loop,
        loopBackTo: 24,
        loopCount: 1,
      },
      'At 01:03, loop back to 00:24 1 time',
    ],
    [
      {
        atTime: 17,
        controlType: ControlType.Loop,
        loopBackTo: 3 * 60 + 12,
        loopCount: 1,
      },
      null,
    ],
  ])(
    'creates string from %j',
    (state: YtpcLoopState, expected: string | null) => {
      if (expected) {
        expect(YtpcLoopEntry.fromState(state).toString()).toBe(expected);
      } else {
        expect(() => YtpcLoopEntry.fromState(state)).toThrow();
      }
    },
  );
});
