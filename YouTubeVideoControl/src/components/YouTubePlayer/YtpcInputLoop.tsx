import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcLoopState } from '../../objects/YtpcEntry/YtpcLoopEntry';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

const LOOP_COUNT_DEFAULT = 3;

function YtpcInputLoop(props: YtpcControlInput) {
  const [loopBackTo, setLoopBackTo] = useState(0);
  const [forever, setForever] = useState(true);
  const [loopCount, setLoopCount] = useState(LOOP_COUNT_DEFAULT);

  const foreverIdInternal = `ytpci-loop-forever-${Math.random().toString(36).substring(2)}`;

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
      <label htmlFor={foreverIdInternal}>
        <input
          id={foreverIdInternal}
          type="checkbox"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setForever(e.target.checked);
          }}
          defaultChecked
        />
        <span>{forever ? 'forever' : 'times'}</span>
      </label>
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
