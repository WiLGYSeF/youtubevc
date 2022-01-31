import React, { useState } from 'react';
import '../../css/style.min.css';

interface YtpcAddProps {
  onCreateEntry(): void;
}

function YtpcAdd(props: YtpcAddProps) {
  return (
    <div className='add' onClick={() => props.onCreateEntry()}>
      +
    </div>
  );
}

export default YtpcAdd;
