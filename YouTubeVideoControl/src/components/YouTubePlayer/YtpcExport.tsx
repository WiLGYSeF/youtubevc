import React from 'react';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';
import { saveAs } from 'file-saver';

interface YtpcExportProps {
  filename: string;
  entries: YouTubePlayerControllerEntry[];
}

function YtpcExport(props: YtpcExportProps) {
  const saveFile = () => {
    const blob = new Blob([JSON.stringify(props.entries, null, 2)], { type: 'text/plain;charset=utf-8' });
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
