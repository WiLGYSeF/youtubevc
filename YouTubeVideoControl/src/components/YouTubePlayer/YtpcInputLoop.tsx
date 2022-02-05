import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcLoopState } from '../../objects/YtpcEntry/YtpcLoopEntry';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';
import Checkbox from '../common/Checkbox';

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
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setForever(e.target.checked);
        }}
        label={forever ? 'forever' : 'times'}
        defaultChecked={FOREVER_DEFAULT}
      />
      {!forever && (
        <input
          className="loop-count"
          type="number"
          min="0"
          defaultValue={LOOP_COUNT_DEFAULT}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setLoopCount(Number(e.target.value));
          }}
        />
      )}
    </div>
  );
}

export default YtpcInputLoop;
