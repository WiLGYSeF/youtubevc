import React, { ChangeEvent, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

interface YtpcInputLoopProps extends YtpcControlInput {

}

function YtpcInputLoop(props: YtpcInputLoopProps) {
  const [loopBackTo, setLoopBackTo] = useState(0);
  const [forever, setForever] = useState(true);
  const [loopCount, setLoopCount] = useState(0);

  const foreverIdInternal = `ytpci-loop-forever-${Math.random().toString(36).substring(2)}`;

  const setControlInputState = () => {
    props.setControlInputState({
      loopBackTo,
      loopCount: forever ? -1 : loopCount,
    });
  };

  return (
    <div className="loop">
      <YtpcInputTime setTime={setLoopBackTo} />
      <input
        id={foreverIdInternal}
        type="checkbox"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setForever(e.target.checked);
          setControlInputState();
        }}
        defaultChecked
      />
      <label htmlFor={foreverIdInternal}>{forever ? 'forever' : 'times'}</label>
      {!forever && (
        <input
          className="loop-count"
          type="number"
          min="0"
          defaultValue="3"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setLoopCount(Number(e.target.value));
            setControlInputState();
          }}
        />
      )}
    </div>
  );
}

export default YtpcInputLoop;
