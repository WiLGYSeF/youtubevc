import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcLoopState } from '../../objects/YtpcEntry/YtpcLoopEntry';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';
import Checkbox from '../common/Checkbox';
import NumberInput from '../common/NumberInput';

const LOOP_COUNT_DEFAULT = 3;
const FOREVER_DEFAULT = true;

function YtpcInputLoop(props: YtpcControlInput) {
  const [loopBackTo, setLoopBackTo] = useState(0);
  const [forever, setForever] = useState(FOREVER_DEFAULT);
  const [loopCount, setLoopCount] = useState(LOOP_COUNT_DEFAULT);

  useEffect(() => {
    const state: YtpcLoopState = {
      loopBackTo,
      loopCount: forever ? -1 : loopCount,
    };
    props.setControlInputState(state);
  }, [loopBackTo, forever, loopCount]);

  return (
    <div className="loop">
      <YtpcInputTime setTime={setLoopBackTo} />
      <Checkbox
        label={forever ? 'forever' : 'times'}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setForever(e.target.checked);
        }}
        defaultChecked={FOREVER_DEFAULT}
      />
      {!forever && (
        <span className="loop-count">
          <NumberInput
            minValue={0}
            defaultValue={LOOP_COUNT_DEFAULT}
            clamp forceValue
            setValue={setLoopCount}
          />
        </span>
      )}
    </div>
  );
}

export default YtpcInputLoop;
