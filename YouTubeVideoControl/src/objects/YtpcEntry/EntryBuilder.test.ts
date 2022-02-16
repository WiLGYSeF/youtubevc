import EntryBuilder from './EntryBuilder';
import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';
import Ytpc360Entry from './Ytpc360Entry';
import YtpcGotoEntry from './YtpcGotoEntry';
import YtpcLoopEntry from './YtpcLoopEntry';
import YtpcPauseEntry from './YtpcPauseEntry';
import YtpcPlaybackRateEntry from './YtpcPlaybackRateEntry';
import YtpcVolumeEntry from './YtpcVolumeEntry';

describe('EntryBuilder', () => {
  it.each([
    [
      {
        atTime: 0,
        controlType: ControlType.Goto,
        gotoTime: 0,
      },
      YtpcGotoEntry,
    ],
    [
      {
        atTime: 1,
        controlType: ControlType.Loop,
        loopBackTo: 0,
        loopCount: -1,
      },
      YtpcLoopEntry,
    ],
    [
      {
        atTime: 0,
        controlType: ControlType.Pause,
        pauseTime: 3,
      },
      YtpcPauseEntry,
    ],
    [
      {
        atTime: 0,
        controlType: ControlType.PlaybackRate,
        playbackRate: 2,
      },
      YtpcPlaybackRateEntry,
    ],
    [
      {
        atTime: 0,
        controlType: ControlType.ThreeSixty,
        sphereProps: {
          yaw: 0,
          pitch: 0,
          roll: 0,
          fov: 100,
        },
        lerpSeconds: -1,
      },
      Ytpc360Entry,
    ],
    [
      {
        atTime: 0,
        controlType: ControlType.Volume,
        volume: 50,
        lerpSeconds: -1,
      },
      YtpcVolumeEntry,
    ],
  ])(
    'builds entry of %j',
    (state: YtpcEntryState, expected: any) => {
      const entry = EntryBuilder.buildEntry(state);
      expect(entry instanceof expected).toBeTruthy();
    },
  );

  it('throws on unknown entry type', () => {
    expect(() => EntryBuilder.buildEntry({} as any)).toThrow();
  });

  it.each([
    ['At 1:01, go to 00:00', YtpcGotoEntry],
    ['At 1:01, set volume to 50', YtpcVolumeEntry],
    ['abcdef', null],
  ])(
    'creates entry from "%s"',
    (str: string, expected: any) => {
      const entry = EntryBuilder.fromString(str);
      if (expected) {
        expect(entry instanceof expected).toBeTruthy();
      } else {
        expect(entry).toBeNull();
      }
    },
  );
});
