import React, { ChangeEvent, KeyboardEvent, useState } from 'react';

import coerceNumber from 'utils/coerceNumber';
import useStatePropBacked from 'utils/useStatePropBacked';

interface NumberInputProps {
  label?: string;
  labelRight?: boolean;

  minValue?: number;
  maxValue?: number;
  step?: number | null;
  defaultValue: number;

  clamp?: boolean;
  forceValue?: boolean;

  onChange(value: number): void;
}

const NUMBER_REGEX = /^-?\d*\.?\d{0,5}$/;
const NONNUMBER_REGEX = /[^\d.-]/g;

function NumberInput(props: NumberInputProps) {
  const [number, setNumber] = useStatePropBacked(props.defaultValue);
  const [value, setValue] = useStatePropBacked(props.defaultValue.toString());

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
        min={props.minValue} max={props.maxValue} step={step ?? 'any'}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const sanitized = e.target.value.replace(NONNUMBER_REGEX, '');
          let num = number;

          if (sanitized.match(NUMBER_REGEX)) {
            num = coerceNumber(
              Number(sanitized),
              props.minValue,
              props.maxValue,
              step,
              doClamp,
            );

            setValue(sanitized);
          }

          props.onChange(num);
          setNumber(num);
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
