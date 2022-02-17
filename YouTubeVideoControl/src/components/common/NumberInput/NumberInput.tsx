import React, { ChangeEvent, KeyboardEvent } from 'react';

import coerceNumber from 'utils/coerceNumber';
import useStatePropBacked from 'utils/useStatePropBacked';

interface NumberInputProps {
  label?: string;
  labelRight?: boolean;

  minValue?: number;
  maxValue?: number;
  step?: number | null;
  value: number;

  clamp?: boolean;
  forceValue?: boolean;

  onChange(value: number): void;
}

const NUMBER_REGEX = /^-?\d*\.\d*$/;
const NONDIGIT_REGEX = /[^\d.-]/g;

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
    <label data-testid="number-input" data-label-right={labelRight}>
      {!labelRight && eLabel}
      <input
        min={props.minValue} max={props.maxValue} step={step ?? 'any'}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const sanitized = e.target.value.replace(NONDIGIT_REGEX, '');
          const val = Number(sanitized);

          const num = coerceNumber(
            val,
            props.minValue,
            props.maxValue,
            step,
            doClamp,
          );

          props.onChange(num);
          setNumber(num);
          setValue(sanitized);
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
