import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './YtpcAdd.module.scss';

interface YtpcAddProps {
  createEntry(): void;
}

function YtpcAdd(props: YtpcAddProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.add} onClick={props.createEntry}>
      <img src="/img/icon/add.png" alt={t('add')} title={t('add')} />
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
