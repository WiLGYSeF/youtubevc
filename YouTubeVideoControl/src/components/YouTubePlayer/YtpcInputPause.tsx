import React, { useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcPauseState } from '../../objects/YtpcEntry/YtpcPauseEntry';
import NumberInput from '../common/NumberInput';

import '../../css/style.min.css';

const PAUSE_FOR_DEFAULT = 3;

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
      <NumberInput
        label=" seconds"
        labelLeft={false}
        minValue={0} step={null}
        defaultValue={PAUSE_FOR_DEFAULT}
        setValue={setPauseFor}
      />
    </div>
  );
}

export default YtpcInputPause;
