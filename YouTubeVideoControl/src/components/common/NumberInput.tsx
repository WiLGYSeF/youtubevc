import React, { ChangeEvent, KeyboardEvent } from 'react';

import coerceNumber from '../../utils/coerceNumber';
import useStatePropBacked from '../../utils/useStatePropBacked';

interface NumberInputProps {
  label?: string;
  labelRight?: boolean;

  minValue?: number;
  maxValue?: number;
  step?: number | null;
  value: number;

  clamp?: boolean;
  forceValue?: boolean;

  setValue(value: number): void;
}

function NumberInput(props: NumberInputProps) {
  const [number, setNumber] = useStatePropBacked(props.value);
  const [value, setValue] = useStatePropBacked(props.value.toString());

  const labelRight = props.labelRight ?? false;
  const doClamp = props.clamp ?? true;
  const forceValue = props.forceValue ?? false;

  let step: number | undefined;
  if (props.step === undefined) {
    step = 1;
  } else if (props.step === null) {
    step = undefined;
  } else {
    step = props.step;
  }

  const eLabel = (
    <span>{props.label}</span>
  );

  const doForceValue = () => {
    if (forceValue) {
      setValue(number.toString());
    }
  };

  return (
    <label data-label-right={labelRight}>
      {!labelRight && eLabel}
      <input
        type="number"
        min={props.minValue} max={props.maxValue} step={step ?? 'any'}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const num = coerceNumber(
            Number(e.target.value),
            props.minValue,
            props.maxValue,
            step,
            doClamp,
          );

          props.setValue(num);
          setNumber(num);
          setValue(e.target.value);
        }}
        onBlur={doForceValue}
        onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            doForceValue();
          }
        }}
      />
      {labelRight && eLabel}
    </label>
  );
}

export default NumberInput;
