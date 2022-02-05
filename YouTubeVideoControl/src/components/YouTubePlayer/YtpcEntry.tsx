import React from 'react';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

interface YtpcEntryProps {
  entry: YouTubePlayerControllerEntry;
  onDeleteEntry(entry: YouTubePlayerControllerEntry): void;
}

function YtpcEntry(props: YtpcEntryProps) {
  return (
    <div className="entry">
      <span>{`${props.entry}`}</span>
      <div
        className="delete"
        onClick={() => {
          props.onDeleteEntry(props.entry);
        }}
      >x</div>
    </div>
  );
}

export default YtpcEntry;
