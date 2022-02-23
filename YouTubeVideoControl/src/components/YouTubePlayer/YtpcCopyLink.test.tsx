import React from 'react';
import { render } from '@testing-library/react';

import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcCopyLink, { BASE_URL } from './YtpcCopyLink';

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

    const expected = `${BASE_URL}/watch?v=${videoId}&entries=${encodeURI(JSON.stringify(entries))}`;
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

    const expected = `${BASE_URL}/watch?v=${videoId}&entries=${encodeURI(JSON.stringify(entries))}`;
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

    const expected = `${BASE_URL}/watch?v=${videoId}&entries=${encodeURI(JSON.stringify(entries))}`;
    expect(copyMock).toHaveBeenCalledTimes(0);
    expect(onCopy).toHaveBeenCalledWith(expected);

    copyMock.mockRestore();
  });
});
