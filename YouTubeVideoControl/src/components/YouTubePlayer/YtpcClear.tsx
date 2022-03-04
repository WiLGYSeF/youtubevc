import React from 'react';

interface YtpcClearProps {
  clearEntries(): void;
}

function YtpcClear(props: YtpcClearProps) {
  return (
    <button type="button" className="clear" onClick={props.clearEntries}>
      Clear Entries
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
