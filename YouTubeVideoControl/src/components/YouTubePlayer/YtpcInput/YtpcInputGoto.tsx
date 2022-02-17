import React, { useEffect } from 'react';

import TimestampInput from 'components/common/TimestampInput/TimestampInput';
import { YtpcGotoState } from 'objects/YtpcEntry/YtpcGotoEntry';
import { secondsToTimestamp } from 'utils/timestr';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

function YtpcInputGoto(props: YtpcControlInput) {
  const pstate = props.state as YtpcGotoState;
  const [gotoTime, setGotoTime] = useStatePropBacked(pstate?.gotoTime ?? 0);

  useEffect(() => {
    const state: YtpcGotoState = {
      atTime: pstate.atTime,
      controlType: pstate.controlType,
      gotoTime,
    };
    props.setEntryState(state);
  }, [gotoTime]);

  return (
    <TimestampInput
      value={secondsToTimestamp(gotoTime)}
      onChange={setGotoTime}
    />
  );
}

export default YtpcInputGoto;
