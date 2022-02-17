import { YouTubePlayer } from 'youtube-player/dist/types';

import { ControlType } from './YouTubePlayerControllerEntry';
import YtpcPlaybackRateEntry, { YtpcPlaybackRateState } from './YtpcPlaybackRateEntry';

describe('YtpcPlaybackRateEntry', () => {
  it('sets the playback rate', () => {
    const entry = YtpcPlaybackRateEntry.fromState({
      atTime: 101,
      controlType: ControlType.PlaybackRate,
      playbackRate: 2,
    });

    const setPlaybackRate = jest.fn() as jest.MockedFunction<YouTubePlayer['setPlaybackRate']>;
    const ytPlayer = jest.fn(() => ({
      setPlaybackRate,
    }));

    entry.performAction(ytPlayer() as unknown as YouTubePlayer);

    expect(setPlaybackRate).toBeCalledTimes(1);
    expect(setPlaybackRate).lastCalledWith(entry.playbackRate);
  });

  it.each([
    ['At 9:45, set playback rate to x1.5', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.PlaybackRate,
      playbackRate: 1.5,
    }],
    ['At 9:45, set playback rate to 1.5', {
      atTime: 9 * 60 + 45,
      controlType: ControlType.PlaybackRate,
      playbackRate: 1.5,
    }],
    ['Aaaa', null],
  ])(
    'creates from string "%s"',
    (str: string, expected: YtpcPlaybackRateState | null) => {
      const result = YtpcPlaybackRateEntry.fromString(str);
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
        controlType: ControlType.PlaybackRate,
        playbackRate: 1.5,
      },
      'At 01:03, set playback rate to x1.5',
    ],
  ])(
    'creates string from %j',
    (state: YtpcPlaybackRateState, expected: string) => {
      if (expected) {
        expect(YtpcPlaybackRateEntry.fromState(state).toString()).toBe(expected);
      } else {
        expect(() => YtpcPlaybackRateEntry.fromState(state)).toThrow();
      }
    },
  );
});
