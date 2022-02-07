import React, { ChangeEvent } from 'react';

import useStatePropBacked from '../../utils/useStatePropBacked';

interface CheckboxProps {
  label: string;
  labelLeft?: boolean;

  checked?: boolean;
  setChecked(checked: boolean): void;
}

function Checkbox(props: CheckboxProps) {
  const labelLeft = props.labelLeft ?? false;
  const [checked, setChecked] = useStatePropBacked(props.checked ?? false);

  const inputIdInternal = `checkbox-${Math.random().toString(36).substring(2)}`;

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
          props.setChecked(isChecked);
          setChecked(isChecked);
        }}
      />
      {!labelLeft && eLabel}
    </label>
  );
}

export default Checkbox;
