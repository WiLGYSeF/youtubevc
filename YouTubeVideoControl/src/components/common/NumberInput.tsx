import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import coerceNumber from '../../utils/coerceNumber';

interface NumberInputProps {
  label?: string;
  labelLeft?: boolean;

  minValue?: number;
  maxValue?: number;
  step?: number | null;
  defaultValue: number;

  clamp?: boolean;
  forceValue?: boolean;

  setValue: (value: number) => void;
}

function NumberInput(props: NumberInputProps) {
  const [number, setNumber] = useState(props.defaultValue);
  const [value, setValue] = useState(props.defaultValue.toString());

  const labelLeft = props.labelLeft ?? true;
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

  if (doClamp && props.minValue === undefined && props.maxValue === undefined) {
    throw new Error('cannot have undefined min and max values when clamping');
  }

  return (
    <label>
      {labelLeft && eLabel}
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
      {!labelLeft && eLabel}
    </label>
  );
}

export default NumberInput;
