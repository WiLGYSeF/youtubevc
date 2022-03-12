import React, { useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';

import YouTubePlayerControllerEntry, { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

import styles from './YtpcEntry.module.scss';

const UPDATE_INTERVAL = 100;

interface YtpcEntryProps {
  entry: YouTubePlayerControllerEntry;
  is360Video?: boolean;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
  editEntry(entry: YouTubePlayerControllerEntry): void;
}

function YtpcEntry(props: YtpcEntryProps) {
  const { t } = useTranslation();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const is360Video = props.is360Video ?? true;

  useEffect(() => {
    // TODO: replace with something better
    const timeout = setTimeout(forceUpdate, UPDATE_INTERVAL);
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div
      className={[
        styles.entry,
        !is360Video && props.entry.controlType === ControlType.ThreeSixty ? styles.disabled : '',
      ].join(' ')}
      data-at-time={props.entry.atTime}
      data-control-type={props.entry.controlType}
      data-entry={JSON.stringify(props.entry)}
    >
      <span>{`${props.entry}`}</span>
      <div className="buttons">
        <div
          className="edit button"
          onClick={() => {
            props.editEntry(props.entry);
          }}
        >
          <img src="/img/icon/edit.png" alt={t('edit')} title={t('edit')} />
        </div>
        <div
          className="delete button"
          onClick={() => {
            props.deleteEntry(props.entry);
          }}
        >
          <img src="/img/icon/close.png" alt={t('delete')} title={t('delete')} />
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
