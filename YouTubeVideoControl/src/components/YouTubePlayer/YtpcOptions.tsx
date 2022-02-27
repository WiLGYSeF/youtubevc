import React from 'react';

import Checkbox from 'components/common/Checkbox/Checkbox';

import styles from './YtpcOptions.module.scss';

interface YtpcOptionsProps {
  useLoopsForShuffling: boolean;
  useLoopCountForWeights: boolean;

  setLoopsForShuffling(enabled: boolean): void;
  setLoopCountForWeights(enabled: boolean): void;
}

function YtpcOptions(props: YtpcOptionsProps) {
  return (
    <div className={styles['option-container']}>
      <Checkbox
        label="Loop controls are shuffle regions"
        defaultChecked={props.useLoopsForShuffling}
        onChange={props.setLoopsForShuffling}
      />
      {props.useLoopsForShuffling && (
        <div className="indent">
          <Checkbox
            label="Use loop counts as shuffle weights"
            defaultChecked={props.useLoopCountForWeights}
            onChange={props.setLoopCountForWeights}
          />
        </div>
      )}
    </div>
  );
}

export default YtpcOptions;
