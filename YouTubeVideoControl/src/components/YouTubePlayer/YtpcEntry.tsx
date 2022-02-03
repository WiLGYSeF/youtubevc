import React, { useState } from 'react';

import YouTubePlayerControllerEntry from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

interface YtpcEntryProps {
  entry: YouTubePlayerControllerEntry;
}

function YtpcEntry(props: YtpcEntryProps) {
  return (
    <div className="entry">
      <span>{`${props.entry}`}</span>
    </div>
  );
}

export default YtpcEntry;
