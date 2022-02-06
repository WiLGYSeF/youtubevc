import React, { useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcPauseState } from '../../objects/YtpcEntry/YtpcPauseEntry';
import TimestampInput from '../common/TimestampInput';
import secondsToTimestamp from '../../utils/secondsToTimestamp';

import '../../css/style.min.css';

const PAUSE_FOR_DEFAULT = 5;

function YtpcInputPause(props: YtpcControlInput) {
  const [pauseFor, setPauseFor] = useState(PAUSE_FOR_DEFAULT);

  useEffect(() => {
    const state: YtpcPauseState = {
      pauseTime: pauseFor,
    };
    props.setControlInputState(state);
  }, [pauseFor]);

  return (
    <div className="pause">
      <TimestampInput
        defaultValue={secondsToTimestamp(PAUSE_FOR_DEFAULT)}
        setTime={setPauseFor}
      />
    </div>
  );
}

export default YtpcInputPause;
