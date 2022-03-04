import React, { useEffect, useReducer } from 'react';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

import styles from './YtpcEntry.module.scss';

const UPDATE_INTERVAL = 100;

interface YtpcEntryProps {
  entry: YouTubePlayerControllerEntry;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
  editEntry(entry: YouTubePlayerControllerEntry): void;
}

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
    <div
      className={styles.entry}
      data-at-time={props.entry.atTime}
      data-control-type={props.entry.controlType}
      data-entry={JSON.stringify(props.entry)}
    >
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

export interface YtpcEntryInputs {
  edit: HTMLElement,
  delete: HTMLElement,
}

export function getInputs(container: HTMLElement): YtpcEntryInputs {
  return {
    edit: container.querySelector('.edit')!,
    delete: container.querySelector('.delete')!,
  };
}

export default YtpcEntry;
