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

export default YtpcClear;
