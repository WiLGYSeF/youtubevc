import React, { ChangeEvent, useState } from 'react';

import '../../css/style.min.css';

interface YtpcInputTimeProps {
  setTime(seconds: number): void;
}

function YtpcInputTime(props: YtpcInputTimeProps) {
  return (
    <span>
      <input
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.setTime(Number(e.target.value))}
      />
    </span>
  );
}

export default YtpcInputTime;
