import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';
import YtpcGotoEntry, { YtpcGotoState } from './YtpcGotoEntry';
import YtpcLoopEntry, { YtpcLoopState } from './YtpcLoopEntry';
import YtpcPauseEntry, { YtpcPauseState } from './YtpcPauseEntry';
import YtpcPlaybackRateEntry, { YtpcPlaybackRateState } from './YtpcPlaybackRateEntry';
import Ytpc360Entry, { Ytpc360State } from './Ytpc360Entry';
import YtpcVolumeEntry, { YtpcVolumeState } from './YtpcVolumeEntry';

class EntryBuilder {
  static buildEntry(type: ControlType, atTime: number, state: object): YouTubePlayerControllerEntry {
    switch (type) {
      case ControlType.Goto: {
        const yest: YtpcGotoState = state as YtpcGotoState;
        return new YtpcGotoEntry(atTime, yest.goto);
      }
      case ControlType.Loop: {
        const yest: YtpcLoopState = state as YtpcLoopState;
        return new YtpcLoopEntry(atTime, yest.loopBackTo, yest.loopCount);
      }
      case ControlType.Pause: {
        const yest: YtpcPauseState = state as YtpcPauseState;
        return new YtpcPauseEntry(atTime, yest.pauseTime);
      }
      case ControlType.PlaybackRate: {
        const yest: YtpcPlaybackRateState = state as YtpcPlaybackRateState;
        return new YtpcPlaybackRateEntry(atTime, yest.playbackRate);
      }
      case ControlType.ThreeSixty: {
        const yest: Ytpc360State = state as Ytpc360State;
        return new Ytpc360Entry(atTime, yest.sphereProps, yest.lerpSeconds);
      }
      case ControlType.Volume: {
        const yest: YtpcVolumeState = state as YtpcVolumeState;
        return new YtpcVolumeEntry(atTime, yest.volume, yest.lerpSeconds);
      }
      default:
        throw new Error('unknown entry type');
    }
  }
}

export default EntryBuilder;
