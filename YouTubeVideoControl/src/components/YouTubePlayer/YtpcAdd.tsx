import React from 'react';

import './YtpcAdd.scss';

interface YtpcAddProps {
  createEntry(): void;
}

function YtpcAdd(props: YtpcAddProps) {
  return (
    <div className="add" onClick={props.createEntry}>
      +
    </div>
  );
}

export default YtpcAdd;
