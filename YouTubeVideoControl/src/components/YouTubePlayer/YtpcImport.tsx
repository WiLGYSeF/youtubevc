import React, { ChangeEvent } from 'react';

import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

interface YtpcImportProps {
  addEntry(
    entries: YouTubePlayerControllerEntry[],
    type: ControlType,
    atTime: number,
    state: object
  ): YouTubePlayerControllerEntry;
  setEntries(entries: YouTubePlayerControllerEntry[]): void;
}

function YtpcImport(props: YtpcImportProps) {
  const loadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const entries: YouTubePlayerControllerEntry[] = [];

      try {
        const data = JSON.parse(ev.target?.result?.toString() ?? '[]');
        for (let i = 0; i < data.length; i += 1) {
          const entry: YouTubePlayerControllerEntry = data[i];
          console.log(entry);
          props.addEntry(entries, entry.controlType, entry.atTime, entry);
        }
      } catch (exc) {
        console.error(exc);
      }

      props.setEntries(entries);
    };
    reader.onerror = () => {
      console.error(reader.error);
    };
    reader.readAsText(file);
  };

  const importIdInternal = `import-${Math.random().toString(36).substring(2)}`;

  return (
    <div>
      <button type="button" onClick={() => document.getElementById(importIdInternal)?.click()}>
        <input
          id={importIdInternal}
          type="file"
          style={{
            display: 'none',
          }}
          onChange={loadFile}
        />
        Import
      </button>
    </div>
  );
}

export default YtpcImport;
