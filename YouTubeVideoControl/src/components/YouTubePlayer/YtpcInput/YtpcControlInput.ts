import { YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

export interface YtpcControlInput {
  defaultState: YtpcEntryState;
  setEntryState(state: YtpcEntryState): void;
  playbackRates?: readonly number[],
}
