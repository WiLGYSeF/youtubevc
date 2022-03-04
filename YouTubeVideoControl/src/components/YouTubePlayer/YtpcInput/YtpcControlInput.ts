import { YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

export interface YtpcControlInput {
  defaultState: YtpcEntryState;
  entryState: YtpcEntryState;
  setEntryState(state: YtpcEntryState): void;
  playbackRates?: readonly number[],
}
