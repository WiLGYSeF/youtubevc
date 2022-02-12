import React, { ChangeEvent } from 'react';

import EntryBuilder from 'objects/YtpcEntry/EntryBuilder';
import YouTubePlayerControllerEntry, { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import trimstr from 'utils/trimstr';

interface Entry {
  controlType: ControlType,
  atTime: number;
}

interface ImportResult {
  entries: YouTubePlayerControllerEntry[];
  success: boolean;
  error: unknown;
}

interface YtpcImportProps {
  addEntry(entries: YouTubePlayerControllerEntry[], entry: YouTubePlayerControllerEntry): void;
  setEntries(entries: YouTubePlayerControllerEntry[]): void;
}

function tryImportJson(
  data: string,
  addEntry: (entries: YouTubePlayerControllerEntry[], entry: YouTubePlayerControllerEntry) => void,
): ImportResult {
  const entries: YouTubePlayerControllerEntry[] = [];

  try {
    const json = JSON.parse(data);
    for (let i = 0; i < json.length; i += 1) {
      const entry: Entry = json[i];

      addEntry(entries, EntryBuilder.buildEntry(entry.controlType, entry.atTime, entry));
    }

    return {
      entries,
      success: true,
      error: null,
    };
  } catch (exc) {
    return {
      entries: [],
      success: false,
      error: exc,
    };
  }
}

function tryImportText(
  data: string,
  addEntry: (entries: YouTubePlayerControllerEntry[], entry: YouTubePlayerControllerEntry) => void,
): ImportResult {
  const entries: YouTubePlayerControllerEntry[] = [];

  try {
    const lines = data.split('\n');

    for (let line of lines) {
      line = trimstr(trimstr(line, '\r'), ' ');

      const entry = EntryBuilder.fromString(line);
      if (entry) {
        addEntry(entries, entry);
      }
    }

    return {
      entries,
      success: entries.length > 0,
      error: null,
    };
  } catch (exc) {
    return {
      entries: [],
      success: false,
      error: exc,
    };
  }
}

function YtpcImport(props: YtpcImportProps) {
  const loadFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const data = ev.target?.result?.toString();

      let result = tryImportJson(data ?? '[]', props.addEntry);
      if (!result.success) {
        result = tryImportText(data ?? '', props.addEntry);
      }

      if (result.success) {
        props.setEntries(result.entries);
      } else {
        throw new Error('could not import file');
      }
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
