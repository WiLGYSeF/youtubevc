import React, { useState } from 'react';

import '../../css/style.min.css';
import { YtpcControlInput } from './YtpcInput';
import YtpcInputTime from './YtpcInputTime';

interface YtpcInputGotoProps extends YtpcControlInput {

}

function YtpcInputGoto(props: YtpcInputGotoProps) {
  return (
    <YtpcInputTime
      setTime={(seconds: number) => props.setControlInputState({
        goto: seconds
      })}
    />
  );
}

export default YtpcInputGoto;
