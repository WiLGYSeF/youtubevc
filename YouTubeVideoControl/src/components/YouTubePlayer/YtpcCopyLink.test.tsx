import React from 'react';
import { render } from '@testing-library/react';

import YouTubePlayerControllerEntry from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import mockI18n from 'utils/test/i18nMock';
import YtpcCopyLink from './YtpcCopyLink';

jest.mock('react-i18next', () => mockI18n());

function entriesToUrlParam(entries: YouTubePlayerControllerEntry[]): string {
  return encodeURI(JSON.stringify(entries.map((e) => e.getState())));
}

describe('YtpcCopyLink', () => {
  it('copies link to clipboard', () => {
    const copyMock = jest.spyOn(YtpcCopyLink.prototype, 'copy')
      .mockImplementation();

    const videoId = 'test-id';
    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];

    const { container } = render(<YtpcCopyLink
      videoId={videoId}
      entries={entries}
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    const expected = `${process.env.REACT_APP_BASE_URL}/watch?v=${videoId}&entries=${entriesToUrlParam(entries)}`;
    expect(copyMock).toHaveBeenCalledWith(expected);

    copyMock.mockRestore();
  });

  it('does nothing when no video id', () => {
    const copyMock = jest.spyOn(YtpcCopyLink.prototype, 'copy')
      .mockImplementation();

    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];

    const { container } = render(<YtpcCopyLink
      videoId={null}
      entries={entries}
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    expect(copyMock).toHaveBeenCalledTimes(0);

    copyMock.mockRestore();
  });

  it('copies link to clipboard and does callback', () => {
    const copyMock = jest.spyOn(YtpcCopyLink.prototype, 'copy')
      .mockImplementation();

    const videoId = 'test-id';
    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];
    const onCopy = jest.fn(() => true);

    const { container } = render(<YtpcCopyLink
      videoId={videoId}
      entries={entries}
      onCopy={onCopy}
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    const expected = `${process.env.REACT_APP_BASE_URL}/watch?v=${videoId}&entries=${entriesToUrlParam(entries)}`;
    expect(copyMock).toHaveBeenCalledWith(expected);
    expect(onCopy).toHaveBeenCalledWith(expected);

    copyMock.mockRestore();
  });

  it('cancels copy from callback', () => {
    const copyMock = jest.spyOn(YtpcCopyLink.prototype, 'copy')
      .mockImplementation();

    const videoId = 'test-id';
    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];
    const onCopy = jest.fn(() => false);

    const { container } = render(<YtpcCopyLink
      videoId={videoId}
      entries={entries}
      onCopy={onCopy}
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    expect(copyMock).toHaveBeenCalledTimes(0);

    copyMock.mockRestore();
  });

  it('copies link to clipboard with loop shuffle', () => {
    const copyMock = jest.spyOn(YtpcCopyLink.prototype, 'copy')
      .mockImplementation();

    const videoId = 'test-id';
    const entries = [
      new YtpcLoopEntry(5, 0),
      new YtpcLoopEntry(15, 7),
      new YtpcLoopEntry(50, 25),
    ];

    const { container } = render(<YtpcCopyLink
      videoId={videoId}
      entries={entries}
      useLoopShuffle
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    const expected = `${process.env.REACT_APP_BASE_URL}/watch?v=${videoId}&loopShuffle=1&entries=${entriesToUrlParam(entries)}`;
    expect(copyMock).toHaveBeenCalledWith(expected);

    copyMock.mockRestore();
  });
});
