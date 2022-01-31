import React, { ReactElement, useState } from 'react';

import YtpcEntry from './YtpcEntry';
import YtpcInput from './YtpcInput';

import '../../css/style.min.css';

interface YouTubePlayerControllerProps {
  entries: any[];
  setEntries(entries: any[]): void;
}

function YouTubePlayerController(props: YouTubePlayerControllerProps) {
  return (
    <div className='yt-controller'>
      <div className='left'>
        <YtpcInput />

        <div className='entry-list'>
          {props.entries.map(e => <YtpcEntry key={e.getKey()} entry={e} />)}
        </div>
      </div>
      <div className='right'>
      </div>
    </div>
  );
}

export default YouTubePlayerController;
