import React from 'react';
import { saveAs } from 'file-saver';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

export enum ExportType {
  Json = 'json',
  Text = 'text',
}

export const LINE_ENDING = '\r\n';

export function entriesToFileData(
  exportType: ExportType,
  entries: YouTubePlayerControllerEntry[],
): string {
  let data = '';
  switch (exportType) {
    case ExportType.Text:
      data = entries.map((e) => e.toStringStateless()).join(LINE_ENDING)
        + LINE_ENDING;
      break;
    case ExportType.Json:
    default:
      data = JSON.stringify(entries, null, 2);
      break;
  }
  return data;
}

interface YtpcExportProps {
  filename: string;
  entries: YouTubePlayerControllerEntry[];

  exportType?: ExportType;
}

function YtpcExport(props: YtpcExportProps) {
  const saveFile = () => {
    const exportType = props.exportType ?? ExportType.Json;
    const data = entriesToFileData(exportType, props.entries);

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    YtpcExport.prototype.saveAs(blob, props.filename);
  };

  return (
    <div>
      <button type="button" onClick={saveFile}>
        Export
      </button>
    </div>
  );
}

export interface YtpcExportInputs {
  button: HTMLButtonElement;
}

export function getInputs(container: HTMLElement): YtpcExportInputs {
  return {
    button: container.querySelector('button')!,
  };
}

// defined here to be able to mock in tests
YtpcExport.prototype.saveAs = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};

export default YtpcExport;
