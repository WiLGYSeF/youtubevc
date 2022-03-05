import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from 'components/Home/Card';
import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import Ytpc360Entry from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import YtpcPlaybackRateEntry from 'objects/YtpcEntry/YtpcPlaybackRateEntry';
import { timestampToSeconds } from 'utils/timestr';
import {
  SEARCHPARAM_ENTRIES, SEARCHPARAM_LOOP_SHUFFLE, SEARCHPARAM_SHUFFLE_WEIGHT, SEARCHPARAM_VIDEO_ID,
} from './YouTubePlayerContainer';

import styles from './Home.module.scss';

interface VideoCardInfo {
  exampleName: string;
  contents: string[];
  entries: YouTubePlayerControllerEntry[];
  params?: [string, string][],
  videoId: string;
}

function cardToUrlParam(card: VideoCardInfo): string {
  return [
    [SEARCHPARAM_VIDEO_ID, card.videoId],
    ...(card.params ?? []),
    [SEARCHPARAM_ENTRIES, JSON.stringify(card.entries.map((e) => e.getState()))],
  ]
    .filter(([, value]) => value.length)
    .map(([key, value]) => `${key}=${encodeURI(value)}`)
    .join('&');
}

function Home() {
  const { t } = useTranslation();

  const videoCards: VideoCardInfo[] = [
    {
      exampleName: 'example',
      contents: [''],
      entries: [],
      videoId: '???',
    },
    {
      exampleName: 'video360',
      contents: [''],
      entries: [
        new YtpcPlaybackRateEntry(0, 2),
        new YtpcPlaybackRateEntry(7, 1),
        new Ytpc360Entry(9, {
          yaw: 30,
          pitch: 0,
          roll: 0,
          fov: 100,
        }, 2),
        new Ytpc360Entry(13, {
          yaw: 0,
          pitch: 50,
          roll: 0,
          fov: 100,
        }, 2),
      ],
      videoId: 'L_tqK4eqelA',
    },
    {
      exampleName: 'loopShuffle',
      contents: [''],
      entries: (
        [
          ['08:27', 5],
          ['12:23', 5],
          ['16:35', 5],
          ['20:45', 5],
          ['29:52', 5],
          ['31:46', 5],
          ['34:18', 5],
          ['37:12', 5],
          ['44:28', 5],
          ['48:01', 5],
          ['50:07', 5],
          ['52:32', 5],
          ['56:05', 5],
          ['01:01:02', 5],
          ['01:05:30', 5],
          ['01:15:20', 5],
        ] as [string, number][]
      ).map(
        ([time, weight], i, a) => new YtpcLoopEntry(
          timestampToSeconds(time),
          timestampToSeconds(i !== 0 ? a[i - 1][0] : '00:00'),
          weight,
        ),
      ),
      params: [
        [SEARCHPARAM_LOOP_SHUFFLE, '1'],
        [SEARCHPARAM_SHUFFLE_WEIGHT, '1'],
      ],
      videoId: 'IoPsgJ2I_zo',
    },
  ];

  return (
    <div className={styles.home}>
      <div className="container">
        <div>
          <h1>YouTubeVC</h1>
          <p>{t('home.intro')}</p>
        </div>

        {videoCards.map((c, i) => (
          <Card
            key={c.exampleName}
            header={t(`home.examples.${c.exampleName}.header`)}
            contents={[
              (<a
                href={`/watch?${cardToUrlParam(c)}`}
              >
                {t(`home.examples.${c.exampleName}.goto`)}
              </a>),
            ]}
            imageSrc={`/img/${c.videoId}.jpg`}
            imageAlt={t('home.examples.youtubeThumbnail')}
            imageTitle={t(`home.examples.${c.exampleName}.title`)}
            // eslint-disable-next-line no-bitwise
            contentOnLeft={(i & 1) === 0}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
