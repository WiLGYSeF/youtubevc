import React, { useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcGotoState } from '../../objects/YtpcEntry/YtpcGotoEntry';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

function YtpcInputGoto(props: YtpcControlInput) {
  const setControlInputState = (seconds: number): void => {
    const state: YtpcGotoState = {
      goto: seconds,
    };
    props.setControlInputState(state);
  };

  useEffect(() => {
    setControlInputState(0);
  }, []);

  return (
    <YtpcInputTime
      setTime={setControlInputState}
    />
  );
}

export default YtpcInputGoto;
