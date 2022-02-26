import React, { useEffect } from 'react';

import Checkbox from 'components/common/Checkbox/Checkbox';
import NumberInput from 'components/common/NumberInput/NumberInput';
import TimestampInput from 'components/common/TimestampInput/TimestampInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcLoopState } from 'objects/YtpcEntry/YtpcLoopEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import './YtpcInputLoop.scss';

const LOOP_COUNT_DEFAULT = 1;

function YtpcInputLoop(props: YtpcControlInput) {
  const pstate = props.defaultState as YtpcLoopState;
  const dLoopBackTo = pstate?.loopBackTo ?? 0;
  const dLoopCount = pstate?.loopCount ?? LOOP_COUNT_DEFAULT;

  const [loopBackTo, setLoopBackTo] = useStatePropBacked(dLoopBackTo);
  const [forever, setForever] = useStatePropBacked((pstate?.loopCount ?? -1) < 0);
  const [loopCount, setLoopCount] = useStatePropBacked(dLoopCount);

  useEffect(() => {
    const state: YtpcLoopState = {
      atTime: pstate.atTime,
      controlType: ControlType.Loop,
      loopBackTo,
      loopCount: forever ? -1 : loopCount,
    };
    props.setEntryState(state);
  }, [loopBackTo, forever, loopCount]);

  return (
    <div className="loop">
      <span className="loop-back-to">
        <TimestampInput
          defaultValue={dLoopBackTo}
          onChange={setLoopBackTo}
        />
      </span>
      <span className="forever">
        <Checkbox
          label={forever ? 'forever' : 'times'}
          defaultChecked={forever}
          onChange={(checked: boolean) => {
            if (!checked) {
              setLoopCount(LOOP_COUNT_DEFAULT);
            }
            setForever(checked);
          }}
        />
      </span>
      <span
        className="loop-count" style={{
          display: forever ? 'none' : '',
        }}
      >
        <NumberInput
          minValue={0}
          defaultValue={dLoopCount}
          forceValue
          onChange={setLoopCount}
        />
      </span>
    </div>
  );
}

export default YtpcInputLoop;
