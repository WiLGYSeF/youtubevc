import React, { useEffect } from 'react';

import TimestampInput from 'components/common/TimestampInput';
import { YtpcPauseState } from 'objects/YtpcEntry/YtpcPauseEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import './YtpcInputPause.scss';

const PAUSE_FOR_DEFAULT = 5;

function YtpcInputPause(props: YtpcControlInput) {
  const pstate = props.state as YtpcPauseState;
  const [pauseFor, setPauseFor] = useStatePropBacked(pstate?.pauseTime ?? PAUSE_FOR_DEFAULT);

  useEffect(() => {
    const state: YtpcPauseState = {
      atTime: pstate.atTime,
      controlType: pstate.controlType,
      pauseTime: pauseFor,
    };
    props.setEntryState(state);
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
