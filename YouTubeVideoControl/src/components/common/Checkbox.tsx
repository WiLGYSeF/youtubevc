import React, { ChangeEvent, useEffect, useState } from 'react';

import { YtpcControlInput } from './YtpcControlInput';
import { YtpcLoopState } from '../../objects/YtpcEntry/YtpcLoopEntry';
import YtpcInputTime from './YtpcInputTime';

import '../../css/style.min.css';

interface CheckboxProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  defaultChecked?: boolean;
  labelRight?: boolean;
}

function Checkbox(props: CheckboxProps) {
  const defaultChecked = props.defaultChecked ?? false;
  const labelRight = props.labelRight ?? true;

  const inputIdInternal = `checkbox-${Math.random().toString(36).substring(2)}`;

  const eLabel = (<span>{props.label}</span>);

  return (
    <label htmlFor={inputIdInternal} className="cpt-checkbox" data-label-right={labelRight}>
      {!labelRight && eLabel}
      <input
        id={inputIdInternal}
        type="checkbox"
        onChange={props.onChange}
        defaultChecked={defaultChecked}
      />
      {labelRight && eLabel}
    </label>
  );
}

export default Checkbox;
