import React from 'react';
import { useTranslation } from 'react-i18next';

interface YtpcClearProps {
  clearEntries(): void;
}

function YtpcClear(props: YtpcClearProps) {
  const { t } = useTranslation();

  return (
    <button type="button" className="clear" onClick={props.clearEntries}>
      {t('youtubeController.clearEntries')}
    </button>
  );
}

export interface YtpcClearInputs {
  clear: HTMLElement;
}

export function getInputs(container: HTMLElement): YtpcClearInputs {
  return {
    clear: container.querySelector('.clear')!,
  };
}

export default YtpcClear;
