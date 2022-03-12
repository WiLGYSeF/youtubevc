import React from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from 'components/common/Checkbox/Checkbox';

import styles from './YtpcOptions.module.scss';

interface YtpcOptionsProps {
  useLoopsForShuffling: boolean;
  useLoopCountForWeights: boolean;

  setLoopsForShuffling(enabled: boolean): void;
  setLoopCountForWeights(enabled: boolean): void;
}

function YtpcOptions(props: YtpcOptionsProps) {
  const { t } = useTranslation();

  return (
    <div className={styles['option-container']}>
      <div className="header">
        {t('youtubeController.options.options')}
        {': '}
      </div>
      <Checkbox
        label={t('youtubeController.options.useLoopShuffle')}
        defaultChecked={props.useLoopsForShuffling}
        onChange={props.setLoopsForShuffling}
      />
      <div
        className="indent" style={{
          display: props.useLoopsForShuffling ? '' : 'none',
        }}
      >
        <Checkbox
          label={t('youtubeController.options.useLoopCountWeights')}
          defaultChecked={props.useLoopCountForWeights}
          onChange={props.setLoopCountForWeights}
        />
      </div>
    </div>
  );
}

export default YtpcOptions;
