import { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

function YtpcInputLoop(props: YtpcControlInput) {
  const [loopBackTo, setLoopBackTo] = useState(0);
  const [forever, setForever] = useState(true);
  const [loopCount, setLoopCount] = useState(3);

  const foreverIdInternal = `ytpci-loop-forever-${Math.random().toString(36).substring(2)}`;

  useEffect(() => {
    props.setControlInputState({
      loopBackTo,
      loopCount: forever ? -1 : loopCount,
    });
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
        {forever ? 'forever' : 'times'}
      </label>
      {!forever && (
        <input
          className="loop-count"
          type="number"
          min="0"
          defaultValue="3"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setLoopCount(Number(e.target.value));
          }}
        />
      )}
    </div>
  );
}

export default YtpcInputLoop;
