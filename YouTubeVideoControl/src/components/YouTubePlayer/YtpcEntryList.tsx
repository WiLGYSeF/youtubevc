import React from 'react';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcEntry from './YtpcEntry';
import YtpcEntryBar from './YtpcEntryBar';

import styles from './YtpcEntryList.module.scss';

interface YtpcEntryListProps {
  entries: YouTubePlayerControllerEntry[];
  barIndex?: number;
  deleteEntry(entry: YouTubePlayerControllerEntry): void;
  editEntry(entry: YouTubePlayerControllerEntry): void;
}

function YtpcEntryList(props: YtpcEntryListProps) {
  const elements = props.entries.map((e, i) => (
    <YtpcEntry
      key={e.getKey()}
      entry={e}
      deleteEntry={props.deleteEntry}
      editEntry={props.editEntry}
    />
  ));

  if (props.barIndex !== undefined) {
    elements.splice(
      props.barIndex,
      0, (
        <YtpcEntryBar key="entrybar" />
      ),
    );
  }

  return (
    <div className={styles['entry-list']}>
      {elements}
    </div>
  );
}

export function getEntries(container: Element): Element[] {
  return Array.from(container.querySelectorAll('.entry'));
}

export default YtpcEntryList;
