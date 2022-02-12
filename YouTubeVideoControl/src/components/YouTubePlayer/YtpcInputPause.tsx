import React, { useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcPauseState } from '../../objects/YtpcEntry/YtpcPauseEntry';
import TimestampInput from '../common/TimestampInput';
import useStatePropBacked from '../../utils/useStatePropBacked';

import '../../css/style.min.css';

const PAUSE_FOR_DEFAULT = 5;

function YtpcInputPause(props: YtpcControlInput) {
  const pstate = props.state as YtpcPauseState;
  const [pauseFor, setPauseFor] = useStatePropBacked(pstate?.pauseTime ?? PAUSE_FOR_DEFAULT);

  useEffect(() => {
    const state: YtpcPauseState = {
      pauseTime: pauseFor,
    };
    props.setControlInputState(state);
  }, [pauseFor]);

  return (
    <div className="pause">
      <TimestampInput
        value={pstate.pauseTime}
        onChange={setPauseFor}
      />
    </div>
  );
}

export default YtpcInputPause;
