import React, { ChangeEvent, useState } from 'react';

import useStatePropBacked from 'utils/useStatePropBacked';

import './Checkbox.scss';

interface CheckboxProps {
  label: string;
  labelLeft?: boolean;

  checked?: boolean;
  onChange(checked: boolean): void;
}

// exported for mocking
export function getIdInternal(): string {
  return `checkbox-${Math.random().toString(36).substring(2)}`;
}

function Checkbox(props: CheckboxProps) {
  const labelLeft = props.labelLeft ?? false;
  const [checked, setChecked] = useStatePropBacked(props.checked ?? false);
  const [inputIdInternal] = useState(getIdInternal());

  const eLabel = (<span>{props.label}</span>);

  return (
    <label htmlFor={inputIdInternal} className="cpt-checkbox" data-label-left={labelLeft}>
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

export default Checkbox;
