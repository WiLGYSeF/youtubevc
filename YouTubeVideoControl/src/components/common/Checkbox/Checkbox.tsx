import React, { ChangeEvent, useState } from 'react';

import useStatePropBacked from 'utils/useStatePropBacked';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  labelLeft?: boolean;

  defaultChecked?: boolean;
  onChange(checked: boolean): void;
}

function Checkbox(props: CheckboxProps) {
  const labelLeft = props.labelLeft ?? false;
  const [checked, setChecked] = useStatePropBacked(props.defaultChecked ?? false);

  const [inputIdInternal] = useState<string>(Checkbox.prototype.getIdInternal());

  const eLabel = (
    <span data-testid="label">{props.label}</span>
  );

  return (
    <label htmlFor={inputIdInternal} className={styles.checkbox}>
      {labelLeft && eLabel}
      <input
        type="checkbox"
        id={inputIdInternal}
        checked={checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const isChecked = e.target.checked;
          props.onChange(isChecked);
          setChecked(isChecked);
        }}
      />
      {!labelLeft && eLabel}
    </label>
  );
}

export interface CheckboxInputs {
  checkbox: HTMLInputElement;
}

export function getInputs(container: HTMLElement): CheckboxInputs {
  return {
    checkbox: container.querySelector('input')!,
  };
}

// defined here to be able to mock in tests
Checkbox.prototype.getIdInternal = (): string => `checkbox-${Math.random().toString(36).substring(2)}`;

export default Checkbox;
