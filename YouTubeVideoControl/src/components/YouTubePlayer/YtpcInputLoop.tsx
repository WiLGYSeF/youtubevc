import React, { ChangeEvent, useEffect } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcLoopState } from '../../objects/YtpcEntry/YtpcLoopEntry';
import Checkbox from '../common/Checkbox';
import NumberInput from '../common/NumberInput';
import TimestampInput from '../common/TimestampInput';
import useStatePropBacked from '../../utils/useStatePropBacked';

import '../../css/style.min.css';

const LOOP_COUNT_DEFAULT = 1;

function YtpcInputLoop(props: YtpcControlInput) {
  const pstate = props.state as YtpcLoopState;
  const [loopBackTo, setLoopBackTo] = useStatePropBacked(pstate?.loopBackTo ?? 0);
  const [forever, setForever] = useStatePropBacked((pstate?.loopCount ?? -1) < 0);
  const [loopCount, setLoopCount] = useStatePropBacked(pstate?.loopCount ?? LOOP_COUNT_DEFAULT);

  useEffect(() => {
    const state: YtpcLoopState = {
      loopBackTo,
      loopCount: forever ? -1 : loopCount,
    };
    props.setControlInputState(state);
  }, [loopBackTo, forever, loopCount]);

  return (
    <div className="loop">
      <TimestampInput
        value={loopBackTo}
        onChange={setLoopBackTo}
      />
      <Checkbox
        label={forever ? 'forever' : 'times'}
        checked={forever}
        onChange={(checked: boolean) => {
          if (!checked) {
            setLoopCount(LOOP_COUNT_DEFAULT);
          }
          setForever(checked);
        }}
      />
      {!forever && (
        <span className="loop-count">
          <NumberInput
            minValue={0}
            value={loopCount}
            forceValue
            onChange={setLoopCount}
          />
        </span>
      )}
    </div>
  );
}

export default YtpcInputLoop;
