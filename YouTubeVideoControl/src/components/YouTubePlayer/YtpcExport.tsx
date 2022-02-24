import React from 'react';
import { saveAs } from 'file-saver';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

export enum ExportType {
  Json = 'json',
  Text = 'text',
}

interface YtpcExportProps {
  filename: string;
  entries: YouTubePlayerControllerEntry[];

  exportType?: ExportType;
}

export const LINE_ENDING = '\r\n';

function YtpcExport(props: YtpcExportProps) {
  const saveFile = () => {
    const exportType = props.exportType ?? ExportType.Json;
    let data = '';

    switch (exportType) {
      case ExportType.Text:
        data = props.entries.map((e) => e.toStringStateless()).join(LINE_ENDING)
          + LINE_ENDING;
        break;
      case ExportType.Json:
      default:
        data = JSON.stringify(props.entries, null, 2);
        break;
    }

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

// defined here to be able to mock in tests
YtpcExport.prototype.saveAs = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};

export default YtpcExport;
