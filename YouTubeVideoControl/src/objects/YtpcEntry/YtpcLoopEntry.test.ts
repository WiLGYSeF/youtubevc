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

    entry.performAction(ytPlayer() as unknown as YouTubePlayer);

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
      entry.performAction(ytPlayer() as unknown as YouTubePlayer);
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
      'At 01:03, loop back to 00:24 5 times (5 loops left)',
    ],
    [
      {
        atTime: 60 + 3,
        controlType: ControlType.Loop,
        loopBackTo: 24,
        loopCount: 1,
      },
      'At 01:03, loop back to 00:24 1 time (1 loop left)',
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
        expect(YtpcLoopEntry.fromState(state).toString()).toEqual(expected);
      } else {
        expect(() => YtpcLoopEntry.fromState(state)).toThrow();
      }
    },
  );

  it('decrements loops left', () => {
    const entry = YtpcLoopEntry.fromState({
      atTime: 60 + 3,
      controlType: ControlType.Loop,
      loopBackTo: 24,
      loopCount: 2,
    });

    expect(entry.toString()).toEqual('At 01:03, loop back to 00:24 2 times (2 loops left)');

    // dot notation is not used because this is private
    // eslint-disable-next-line @typescript-eslint/dot-notation
    entry['loopNum'] += 1;
    expect(entry.toString()).toEqual('At 01:03, loop back to 00:24 2 times (1 loop left)');

    // dot notation is not used because this is private
    // eslint-disable-next-line @typescript-eslint/dot-notation
    entry['loopNum'] += 1;
    expect(entry.toString()).toEqual('At 01:03, loop back to 00:24 2 times (0 loops left)');
  });

  it('restores state', () => {
    const entry = YtpcLoopEntry.fromState({
      atTime: 60 + 3,
      controlType: ControlType.Loop,
      loopBackTo: 24,
      loopCount: 2,
    });

    expect(entry.loopNumber).toEqual(0);

    // dot notation is not used because this is private
    // eslint-disable-next-line @typescript-eslint/dot-notation
    entry['loopNum'] += 1;
    expect(entry.loopNumber).toEqual(1);

    entry.restoreState();
    expect(entry.loopNumber).toEqual(0);
  });
});
