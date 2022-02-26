import React, { useEffect } from 'react';

import TimestampInput from 'components/common/TimestampInput/TimestampInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcGotoState } from 'objects/YtpcEntry/YtpcGotoEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

function YtpcInputGoto(props: YtpcControlInput) {
  const pstate = props.defaultState as YtpcGotoState;
  const dGotoTime = pstate?.gotoTime ?? 0;
  const [gotoTime, setGotoTime] = useStatePropBacked(dGotoTime);

  useEffect(() => {
    const state: YtpcGotoState = {
      atTime: props.entryState.atTime,
      controlType: ControlType.Goto,
      gotoTime,
    };
    props.setEntryState(state);
  }, [gotoTime]);

  return (
    <TimestampInput
      defaultValue={dGotoTime}
      onChange={setGotoTime}
    />
  );
}

export default YtpcInputGoto;
