import React, { useEffect, useReducer } from 'react';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

import './YtpcEntry.scss';

interface YtpcEntryProps {
  entry: YouTubePlayerControllerEntry;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
  editEntry(entry: YouTubePlayerControllerEntry): void;
}

const UPDATE_INTERVAL = 100;

function YtpcEntry(props: YtpcEntryProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    // TODO: replace with something better
    const timeout = setTimeout(forceUpdate, UPDATE_INTERVAL);
    return () => {
      clearTimeout(timeout);
    };
  });

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
