import React from 'react';
import { Router } from 'react-router-dom';
import YouTube from 'react-youtube';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

import mockI18n from 'utils/test/i18nMock';
import YouTubePlayerContainer from './YouTubePlayerContainer';

jest.mock('react-i18next', () => mockI18n());

jest.mock('react-youtube');

describe('YouTubePlayerContainer', () => {
  it('gets video id from url', () => {
    const videoId = '_BSSJi-sHh8';
    const url = `localhost:3000/watch?v=${videoId}`;

    const history = createMemoryHistory();
    history.push(url);

    render(
      <Router navigator={history} location={url}>
        <YouTubePlayerContainer />
      </Router>,
    );

    expect((YouTube as unknown as jest.Mock).mock.calls[0][0].videoId).toEqual(videoId);
  });
});
