import React, { useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcGotoState } from '../../objects/YtpcEntry/YtpcGotoEntry';
import TimestampInput from '../common/TimestampInput';
import secondsToTimestamp from '../../utils/secondsToTimestamp';
import useStatePropBacked from '../../utils/useStatePropBacked';

import '../../css/style.min.css';

function YtpcInputGoto(props: YtpcControlInput) {
  const pstate = props.state as YtpcGotoState;
  const [gotoTime, setGotoTime] = useStatePropBacked(pstate?.gotoTime ?? 0);

  useEffect(() => {
    const state: YtpcGotoState = {
      gotoTime: gotoTime,
    };
    props.setControlInputState(state);
  }, [gotoTime]);

  return (
    <TimestampInput
      value={secondsToTimestamp(gotoTime)}
      onChange={setGotoTime}
    />
  );
}

export default YtpcInputGoto;
