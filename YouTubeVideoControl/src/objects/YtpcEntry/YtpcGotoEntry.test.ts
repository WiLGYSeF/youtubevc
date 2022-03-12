import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcGotoEntry, { YtpcGotoState } from './YtpcGotoEntry';

describe('YtpcGotoEntry', () => {
  it('goto', () => {
    const entry = YtpcGotoEntry.fromState({
      atTime: 17,
      controlType: ControlType.Goto,
      gotoTime: 34,
    });

    const seekTo = jest.fn() as jest.MockedFunction<YouTubePlayer['seekTo']>;
    const ytPlayer = jest.fn(() => ({
      seekTo,
    }));

    const result = entry.performAction(ytPlayer() as unknown as YouTubePlayer);

    expect(seekTo).toBeCalledTimes(1);
    expect(seekTo).lastCalledWith(entry.gotoTime, true);
    expect(result).toEqual({
      currentTime: entry.gotoTime,
    });
  });

  it.each([
    ['At 01:03, go to 42:51', {
      atTime: 60 + 3,
      controlType: ControlType.Goto,
      gotoTime: 42 * 60 + 51,
    }],
    ['Aaaa', null],
  ])(
    'creates from string "%s"',
    (str: string, expected: YtpcGotoState | null) => {
      const result = YtpcGotoEntry.fromString(str);
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
        controlType: ControlType.Goto,
        gotoTime: 42 * 60 + 51,
      },
      'At 01:03, go to 42:51',
    ],
  ])(
    'creates string from %j',
    (state: YtpcGotoState, expected: string) => {
      expect(YtpcGotoEntry.fromState(state).toString()).toEqual(expected);
    },
  );
});
