import React, { ChangeEvent } from 'react';

import '../../css/style.min.css';

interface CheckboxProps {
  label: string;
  labelRight?: boolean;

  defaultChecked?: boolean;

  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Checkbox(props: CheckboxProps) {
  const labelRight = props.labelRight ?? true;
  const defaultChecked = props.defaultChecked ?? false;

  const inputIdInternal = `checkbox-${Math.random().toString(36).substring(2)}`;

  const eLabel = (<span>{props.label}</span>);

  return (
    <label htmlFor={inputIdInternal} className="cpt-checkbox" data-label-right={labelRight}>
      {!labelRight && eLabel}
      <input type="checkbox"
        id={inputIdInternal}
        onChange={props.onChange}
        defaultChecked={defaultChecked}
      />
      {labelRight && eLabel}
    </label>
  );
}

export default Checkbox;
