import React from 'react';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';

import YouTubePlayerControllerEntry, { YtpcEntryState } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';

export interface JsonExportObject {
  entries: YtpcEntryState[];
  options?: { [key: string]: string },
}

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
      data = JSON.stringify({
        entries: entries.map((e) => e.getState()),
      } as JsonExportObject, null, 2);
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
  const { t } = useTranslation();

  const saveFile = () => {
    const exportType = props.exportType ?? ExportType.Json;
    const data = entriesToFileData(exportType, props.entries);

    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    YtpcExport.prototype.saveAs(blob, props.filename);
  };

  return (
    <button type="button" onClick={saveFile}>
      {t('export')}
    </button>
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
