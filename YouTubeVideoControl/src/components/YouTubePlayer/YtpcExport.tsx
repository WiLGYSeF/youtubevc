import React from 'react';
import { saveAs } from 'file-saver';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

export enum ExportType {
  Json = 'json',
  Text = 'text',
}

interface YtpcExportProps {
  filename: string;
  entries: YouTubePlayerControllerEntry[];

  exportType?: ExportType;
}

const LINE_ENDING = '\r\n';

function YtpcExport(props: YtpcExportProps) {
  const saveFile = () => {
    const exportType = props.exportType ?? ExportType.Json;
    let data = '';

    switch (exportType) {
      case ExportType.Json:
      default:
        data = JSON.stringify(props.entries, null, 2);
        break;
      case ExportType.Text:
        data = props.entries.map((e) => e.toString()).join(LINE_ENDING)
          + LINE_ENDING;
        break;
    }

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, props.filename);
  };

  return (
    <div>
      <button type="button" onClick={saveFile}>
        Export
      </button>
    </div>
  );
}

export default YtpcExport;
