import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox, { getInputs as checkboxGetInputs, CheckboxInputs } from 'components/common/Checkbox/Checkbox';
import NumberInput, { getInputs as numberGetInputs, NumberInputInputs } from 'components/common/NumberInput/NumberInput';
import TimestampInput, { getInputs as timestampGetInputs, TimestampInputsInput } from 'components/common/TimestampInput/TimestampInput';
import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import { YtpcLoopState } from 'objects/YtpcEntry/YtpcLoopEntry';
import useStatePropBacked from 'utils/useStatePropBacked';
import { YtpcControlInput } from './YtpcControlInput';

import styles from './YtpcInputLoop.module.scss';

const LOOP_COUNT_DEFAULT = 1;

function YtpcInputLoop(props: YtpcControlInput) {
  const { t } = useTranslation();

  const pstate = props.defaultState as YtpcLoopState;
  const dLoopBackTo = pstate?.loopBackTo ?? 0;
  const dLoopCount = Math.max(pstate?.loopCount ?? LOOP_COUNT_DEFAULT, 0);

  const [loopBackTo, setLoopBackTo] = useStatePropBacked(dLoopBackTo);
  const [forever, setForever] = useStatePropBacked((pstate?.loopCount ?? -1) < 0);
  const [loopCount, setLoopCount] = useStatePropBacked(dLoopCount);

  useEffect(() => {
    const state: YtpcLoopState = {
      atTime: props.entryState.atTime,
      controlType: ControlType.Loop,
      loopBackTo,
      loopCount: forever ? -1 : loopCount,
    };
    props.setEntryState(state);
  }, [loopBackTo, forever, loopCount]);

  return (
    <div className={styles.loop}>
      <span data-testid="loop-back-to">
        <TimestampInput
          defaultValue={dLoopBackTo}
          onChange={setLoopBackTo}
        />
      </span>
      <span data-testid="forever">
        <Checkbox
          label={forever ? t('forever') : t('times')}
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

export interface YtpcInputLoopInputs {
  loopBackTo: TimestampInputsInput;
  forever: CheckboxInputs;
  loopCount: NumberInputInputs;
}

export function getInputs(container: HTMLElement): YtpcInputLoopInputs {
  return {
    loopBackTo: timestampGetInputs(container.querySelector('[data-testid="loop-back-to"]')!),
    forever: checkboxGetInputs(container.querySelector('[data-testid="forever"]')!),
    loopCount: numberGetInputs(container.querySelector('.loop-count')!),
  };
}

export default YtpcInputLoop;
