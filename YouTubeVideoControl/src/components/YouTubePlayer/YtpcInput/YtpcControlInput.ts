import { YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

export interface YtpcControlInput {
  state: YtpcEntryState;
  setEntryState(state: YtpcEntryState): void;
}
