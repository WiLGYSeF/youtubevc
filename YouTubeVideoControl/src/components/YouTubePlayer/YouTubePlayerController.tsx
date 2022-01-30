import React, { useState } from 'react';

import YouTubePlayerControllerEntry from './YouTubePlayerControllerEntry';
import YtpcAdd from './YtpcAdd';
import YtpcInput from './YtpcInput';

import '../../css/style.min.css';

function YouTubePlayerController() {
  const [entries, setEntries] = useState([]);

  return (
    <div className='yt-controller'>
      <YtpcInput />

      <div className='entry-list'>
        {entries.map(e => <YouTubePlayerControllerEntry />)}
      </div>
    </div>
  );
}

export default YouTubePlayerController;
