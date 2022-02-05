import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcPauseState } from '../../objects/YtpcEntry/YtpcPauseEntry';

import '../../css/style.min.css';

const PAUSE_FOR_DEFAULT = 3;

function YtpcInputPause(props: YtpcControlInput) {
  const [pauseFor, setPauseFor] = useState(PAUSE_FOR_DEFAULT);

  useEffect(() => {
    const state: YtpcPauseState = {
      pauseTime: pauseFor
    };
    props.setControlInputState(state);
  }, [pauseFor]);

  return (
    <div className="pause">
      <input
        type="number"
        min="0"
        defaultValue={PAUSE_FOR_DEFAULT}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setPauseFor(Number(e.target.value));
        }}
      />
    </div>
  );
}

export default YtpcInputPause;
