import React from 'react';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcEntry from './YtpcEntry';

import '../../css/style.min.css';
import YtpcEntryBar from './YtpcEntryBar';

interface YtpcEntryListProps {
  entries: YouTubePlayerControllerEntry[];
  barIndex: number;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
}

function YtpcEntryList(props: YtpcEntryListProps) {
  const elements = props.entries.map((e, i) => (
    <YtpcEntry
      key={`${i}-${e.getKey()}`}
      entry={e}
      onDeleteEntry={props.deleteEntry}
    />
  ));

  elements.splice(
    props.barIndex,
    0, (
      <YtpcEntryBar />
    ),
  );

  return (
    <div className="entry-list">
      {elements}
    </div>
  );
}

export default YtpcEntryList;
