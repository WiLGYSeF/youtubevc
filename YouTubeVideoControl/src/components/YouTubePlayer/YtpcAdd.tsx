import React from 'react';

import styles from './YtpcAdd.module.scss';

interface YtpcAddProps {
  createEntry(): void;
}

function YtpcAdd(props: YtpcAddProps) {
  return (
    <div className={styles.add} onClick={props.createEntry}>
      +
    </div>
  );
}

export interface YtpcAddInputs {
  add: HTMLElement;
}

export function getInputs(container: HTMLElement): YtpcAddInputs {
  return {
    add: container.querySelector('.add')!,
  };
}

export default YtpcAdd;
