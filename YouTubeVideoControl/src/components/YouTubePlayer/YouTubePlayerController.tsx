import React from 'react';

import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcEntry from './YtpcEntry';
import YtpcInput from './YtpcInput';

import '../../css/style.min.css';
import EntryBuilder from '../../objects/YtpcEntry/EntryBuilder';

interface YouTubePlayerControllerProps {
  entries: any[];
  setEntries(entries: any[]): void;
}

function YouTubePlayerController(props: YouTubePlayerControllerProps) {
  const onCreateEntry = (type: ControlType, atTime: number, state: object): void => {
    const entry = EntryBuilder.buildEntry(type, atTime, state);

    // TODO: binary insert
    props.setEntries([...props.entries, entry].sort((a: YouTubePlayerControllerEntry, b: YouTubePlayerControllerEntry): number => {
      return a.atTime - b.atTime;
    }));
  };

  return (
    <div className="yt-controller">
      <div className="left">
        <YtpcInput onCreateEntry={onCreateEntry} />

        <div className="entry-list">
          {props.entries.map((e, i) => <YtpcEntry key={`${i}-${e.getKey()}`} entry={e} />)}
        </div>
      </div>
      <div className="right" />
    </div>
  );
}

export default YouTubePlayerController;
