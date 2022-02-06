import React from 'react';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

interface YtpcEntryProps {
  entry: YouTubePlayerControllerEntry;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
  editEntry(entry: YouTubePlayerControllerEntry): void;
}

function YtpcEntry(props: YtpcEntryProps) {
  return (
    <div className="entry">
      <span>{`${props.entry}`}</span>
      <div className="buttons">
        <div
          className="edit"
          onClick={() => {
            props.editEntry(props.entry);
          }}
        >
          e
        </div>
        <div
          className="delete"
          onClick={() => {
            props.deleteEntry(props.entry);
          }}
        >
          x
        </div>
      </div>
    </div>
  );
}

export default YtpcEntry;
