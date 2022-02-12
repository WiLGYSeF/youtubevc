import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';
import Ytpc360Entry, { Ytpc360State } from './Ytpc360Entry';
import YtpcGotoEntry, { YtpcGotoState } from './YtpcGotoEntry';
import YtpcLoopEntry, { YtpcLoopState } from './YtpcLoopEntry';
import YtpcPauseEntry, { YtpcPauseState } from './YtpcPauseEntry';
import YtpcPlaybackRateEntry, { YtpcPlaybackRateState } from './YtpcPlaybackRateEntry';
import YtpcVolumeEntry, { YtpcVolumeState } from './YtpcVolumeEntry';

class EntryBuilder {
  static buildEntry(state: YtpcEntryState): YouTubePlayerControllerEntry {
    switch (state.controlType) {
      case ControlType.Goto: {
        const yest: YtpcGotoState = state as YtpcGotoState;
        return new YtpcGotoEntry(state.atTime, yest.gotoTime);
      }
      case ControlType.Loop: {
        const yest: YtpcLoopState = state as YtpcLoopState;
        return new YtpcLoopEntry(state.atTime, yest.loopBackTo, yest.loopCount);
      }
      case ControlType.Pause: {
        const yest: YtpcPauseState = state as YtpcPauseState;
        return new YtpcPauseEntry(state.atTime, yest.pauseTime);
      }
      case ControlType.PlaybackRate: {
        const yest: YtpcPlaybackRateState = state as YtpcPlaybackRateState;
        return new YtpcPlaybackRateEntry(state.atTime, yest.playbackRate);
      }
      case ControlType.ThreeSixty: {
        const yest: Ytpc360State = state as Ytpc360State;
        return new Ytpc360Entry(state.atTime, yest.sphereProps, yest.lerpSeconds);
      }
      case ControlType.Volume: {
        const yest: YtpcVolumeState = state as YtpcVolumeState;
        return new YtpcVolumeEntry(state.atTime, yest.volume, yest.lerpSeconds);
      }
      default:
        throw new Error('unknown entry type');
    }
  }

  static fromString(str: string): YouTubePlayerControllerEntry | null {
    const entryList = [
      Ytpc360Entry,
      YtpcGotoEntry,
      YtpcLoopEntry,
      YtpcPauseEntry,
      YtpcPlaybackRateEntry,
      YtpcVolumeEntry,
    ];

    let result: YouTubePlayerControllerEntry | null = null;

    for (const entry of entryList) {
      const entryResult = entry.fromString(str);
      if (entryResult) {
        result = entryResult;
        break;
      }
    }

    return result;
  }
}

export default EntryBuilder;
