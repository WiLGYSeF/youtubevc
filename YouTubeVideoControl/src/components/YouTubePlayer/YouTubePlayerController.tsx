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
    props.setEntries([...props.entries, entry].sort(
      (a: YouTubePlayerControllerEntry, b: YouTubePlayerControllerEntry): number => a.atTime - b.atTime,
    ));
  };

  const onDeleteEntry = (entry: YouTubePlayerControllerEntry): void => {
    props.setEntries([...props.entries.filter(e => e !== entry)]);
  };

  return (
    <div className="yt-controller">
      <div className="left">
        <YtpcInput onCreateEntry={onCreateEntry} />

        <div className="entry-list">
          {props.entries.map((e, i) => (
            <YtpcEntry
              key={`${i}-${e.getKey()}`}
              entry={e}
              onDeleteEntry={onDeleteEntry}
            />
          ))}
        </div>
      </div>
      <div className="right" />
    </div>
  );
}

export default YouTubePlayerController;
