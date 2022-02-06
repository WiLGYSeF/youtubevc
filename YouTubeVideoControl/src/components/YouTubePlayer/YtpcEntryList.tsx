import React from 'react';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcEntry from './YtpcEntry';
import YtpcEntryBar from './YtpcEntryBar';

import '../../css/style.min.css';

interface YtpcEntryListProps {
  entries: YouTubePlayerControllerEntry[];
  barIndex: number;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
  editEntry(entry: YouTubePlayerControllerEntry): void;
}

function YtpcEntryList(props: YtpcEntryListProps) {
  const elements = props.entries.map((e, i) => (
    <YtpcEntry
      key={`${i}-${e.getKey()}`}
      entry={e}
      deleteEntry={props.deleteEntry}
      editEntry={props.editEntry}
    />
  ));

  elements.splice(
    props.barIndex,
    0, (
      <YtpcEntryBar key="entrybar" />
    ),
  );

  return (
    <div className="entry-list">
      {elements}
    </div>
  );
}

export default YtpcEntryList;
