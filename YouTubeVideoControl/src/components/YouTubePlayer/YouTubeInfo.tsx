import React, { useEffect, useReducer } from 'react';
import { YouTubePlayer } from 'youtube-player/dist/types';

import styles from './YouTubeInfo.module.scss';

interface VideoData {
  author: string;
  title: string;
  video_id: string;
  video_quality: string;
  video_quality_features: any[];
}

const EVENT_ONSTATECHANGE = 'onStateChange';

const AUTHOR_PLACEHOLDER = '. . .';

interface YouTubeInfoProps {
  ytPlayer?: YouTubePlayer;
}

function YouTubeInfo(props: YouTubeInfoProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  let videoData: VideoData | undefined;
  if (props.ytPlayer && 'getVideoData' in props.ytPlayer) {
    // undocumented function
    videoData = (props.ytPlayer as any).getVideoData();
  }

  useEffect(() => {
    const onStateChange = () => {
      forceUpdate();
    };

    props.ytPlayer?.addEventListener(EVENT_ONSTATECHANGE, onStateChange);

    return () => {
      props.ytPlayer?.removeEventListener(EVENT_ONSTATECHANGE, onStateChange);
    };
  }, [props.ytPlayer]);

  return videoData && Object.keys(videoData).length ? (
    <div className={styles.info}>
      <h1 className="title">{videoData.title}</h1>
      <div className="author">{videoData.author || AUTHOR_PLACEHOLDER}</div>
    </div>
  ) : (<div />);
}

export default YouTubeInfo;
