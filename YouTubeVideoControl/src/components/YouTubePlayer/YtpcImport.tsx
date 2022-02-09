import React, { useEffect, useState } from 'react';

import YouTubePlayerControllerEntry, { ControlType } from '../../objects/YtpcEntry/YouTubePlayerControllerEntry';

import '../../css/style.min.css';

interface YtpcImportProps {
  createEntry(type: ControlType, atTime: number, state: object): YouTubePlayerControllerEntry;
}

function YtpcImport(props: YtpcImportProps) {
  return (
    <div>
      <button type="button">
        Import
      </button>
    </div>
  );
}

export default YtpcImport;
