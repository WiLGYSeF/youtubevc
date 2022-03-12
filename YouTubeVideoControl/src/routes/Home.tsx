import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Card from 'components/Home/Card';
import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import Ytpc360Entry from 'objects/YtpcEntry/Ytpc360Entry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import YtpcPlaybackRateEntry from 'objects/YtpcEntry/YtpcPlaybackRateEntry';
import YtpcVolumeEntry from 'objects/YtpcEntry/YtpcVolumeEntry';
import { timestampToSeconds } from 'utils/timestr';
import {
  SEARCHPARAM_ENTRIES, SEARCHPARAM_LOOP_SHUFFLE, SEARCHPARAM_SHUFFLE_WEIGHT, SEARCHPARAM_VIDEO_ID,
} from './YouTubePlayerContainer';

import styles from './Home.module.scss';

interface VideoCardInfo {
  exampleName: string;
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
      exampleName: 'video360',
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
      exampleName: 'example',
      entries: [
        new YtpcVolumeEntry(0, 20),
        new YtpcVolumeEntry(0.5, 100, 4),
        new YtpcVolumeEntry(3 * 60 + 17, 20, 5),
        new YtpcLoopEntry(3 * 60 + 22, 15),
        new YtpcVolumeEntry(15, 100, 3),
      ],
      videoId: 'dQw4w9WgXcQ',
    },
    {
      exampleName: 'loopShuffle',
      entries: (
        [
          ['08:27', 9],
          ['12:23', 6],
          ['16:35', 4],
          ['20:45', 6],
          ['29:52', 6],
          ['31:46', 4],
          ['34:18', 4],
          ['37:12', 3],
          ['44:28', 4],
          ['48:01', 4],
          ['50:07', 4],
          ['52:32', 4],
          ['56:05', 6],
          ['01:01:02', 9],
          ['01:05:30', 4],
          ['01:15:20', 3],
        ] as [string, number][]
      ).map(
        ([time, weight], i, a) => new YtpcLoopEntry(
          timestampToSeconds(time),
          timestampToSeconds(i !== 0 ? a[i - 1][0] : '00:00') + 0.1,
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
        <div className="intro">
          <h1>YouTubeVC</h1>
          <p>{t('home.intro.1')}</p>
          <p>
            <Trans i18nKey="home.intro.2">
              Just change
              <code></code>
              to
              <code></code>
              in the URL bar.
            </Trans>
          </p>
        </div>

        {videoCards.map((c, i) => (
          <Card
            key={c.exampleName}
            header={t(`home.examples.${c.exampleName}.header`)}
            contents={[
              t(`home.examples.${c.exampleName}.description`),
              (
                <a
                  key="end-link"
                  href={`/watch?${cardToUrlParam(c)}`}
                >
                  {t(`home.examples.${c.exampleName}.goto`)}
                </a>
              ),
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
