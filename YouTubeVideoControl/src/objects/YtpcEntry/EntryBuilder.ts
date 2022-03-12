import YouTubePlayerControllerEntry, { ControlType, YtpcEntryState } from './YouTubePlayerControllerEntry';
import Ytpc360Entry, { Ytpc360State } from './Ytpc360Entry';
import YtpcGotoEntry, { YtpcGotoState } from './YtpcGotoEntry';
import YtpcLoopEntry, { YtpcLoopState } from './YtpcLoopEntry';
import YtpcPauseEntry, { YtpcPauseState } from './YtpcPauseEntry';
import YtpcPlaybackRateEntry, { YtpcPlaybackRateState } from './YtpcPlaybackRateEntry';
import YtpcVolumeEntry, { YtpcVolumeState } from './YtpcVolumeEntry';

class EntryBuilder {
  static buildEntry(state: YtpcEntryState): YouTubePlayerControllerEntry {
    let entry: YouTubePlayerControllerEntry;
    switch (state.controlType) {
      case ControlType.Goto:
        entry = YtpcGotoEntry.fromState(state as YtpcGotoState);
        break;
      case ControlType.Loop:
        entry = YtpcLoopEntry.fromState(state as YtpcLoopState);
        break;
      case ControlType.Pause:
        entry = YtpcPauseEntry.fromState(state as YtpcPauseState);
        break;
      case ControlType.PlaybackRate:
        entry = YtpcPlaybackRateEntry.fromState(state as YtpcPlaybackRateState);
        break;
      case ControlType.ThreeSixty:
        entry = Ytpc360Entry.fromState(state as Ytpc360State);
        break;
      case ControlType.Volume:
        entry = YtpcVolumeEntry.fromState(state as YtpcVolumeState);
        break;
      default:
        throw new Error('unknown entry type');
    }

    return entry;
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
