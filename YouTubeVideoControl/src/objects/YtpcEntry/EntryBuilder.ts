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
      case ControlType.Goto:
        const gotoState: YtpcGotoState = state as YtpcGotoState;
        return new YtpcGotoEntry(atTime, gotoState.goto);
      case ControlType.Loop:
        const loopState: YtpcLoopState = state as YtpcLoopState;
        return new YtpcLoopEntry(atTime, loopState.loopBackTo, loopState.loopCount);
      case ControlType.Pause:
        const pauseState: YtpcPauseState = state as YtpcPauseState;
        return new YtpcPauseEntry(atTime, pauseState.pauseTime);
      case ControlType.PlaybackRate:
        const playbackRateState: YtpcPlaybackRateState = state as YtpcPlaybackRateState;
        return new YtpcPlaybackRateEntry(atTime, playbackRateState.playbackRate);
      case ControlType.ThreeSixty:
        const threeSixtyState: Ytpc360State = state as Ytpc360State;
        return new Ytpc360Entry(atTime, threeSixtyState.sphereProps, threeSixtyState.lerpSeconds);
      case ControlType.Volume:
        const volumeState: YtpcVolumeState = state as YtpcVolumeState;
        return new YtpcVolumeEntry(atTime, volumeState.volume, volumeState.lerpSeconds);
    }
  }
}

export default EntryBuilder;
