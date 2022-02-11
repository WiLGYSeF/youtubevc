import React from 'react';

import Checkbox from '../common/Checkbox';

import '../../css/style.min.css';

interface YtpcOptionsProps {
  useLoopsForShuffling: boolean;
  useLoopCountForWeights: boolean;

  setLoopsForShuffling(enabled: boolean): void;
  setLoopCountForWeights(enabled: boolean): void;
}

function YtpcOptions(props: YtpcOptionsProps) {
  return (
    <div className="option-container">
      <Checkbox
        label="Loop controls are shuffle regions"
        checked={props.useLoopsForShuffling}
        onChange={props.setLoopsForShuffling}
      />
      {props.useLoopsForShuffling && (
        <div className="indent">
          <Checkbox
            label="Use loop counts as shuffle weights"
            checked={props.useLoopCountForWeights}
            onChange={props.setLoopCountForWeights}
          />
        </div>
      )}
    </div>
  );
}

export default YtpcOptions;
