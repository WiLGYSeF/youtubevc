import React, { useEffect } from 'react';

import TimestampInput from 'components/common/TimestampInput/TimestampInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcPauseState } from 'objects/YtpcEntry/YtpcPauseEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import './YtpcInputPause.scss';

const PAUSE_FOR_DEFAULT = 5;

function YtpcInputPause(props: YtpcControlInput) {
  const pstate = props.defaultState as YtpcPauseState;
  const dPauseTime = pstate?.pauseTime ?? PAUSE_FOR_DEFAULT;
  const [pauseFor, setPauseFor] = useStatePropBacked(dPauseTime);

  useEffect(() => {
    const state: YtpcPauseState = {
      atTime: props.entryState.atTime,
      controlType: ControlType.Pause,
      pauseTime: pauseFor,
    };
    props.setEntryState(state);
  }, [pauseFor]);

  return (
    <div className="pause">
      <TimestampInput
        defaultValue={dPauseTime}
        onChange={setPauseFor}
      />
    </div>
  );
}

export default YtpcInputPause;
