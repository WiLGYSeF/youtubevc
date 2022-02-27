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

export default YtpcAdd;
