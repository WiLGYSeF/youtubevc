import React, { useEffect, useState } from 'react';

import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

interface YtpcCopyLinkProps {
  entries: YouTubePlayerControllerEntry[];
}

function YtpcCopyLink(props: YtpcCopyLinkProps) {
  return (
    <div>
      <button type="button">
        Copy Link
      </button>
    </div>
  );
}

export default YtpcCopyLink;
