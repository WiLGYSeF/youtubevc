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

    expect(copyMock).toHaveBeenCalledWith(
      `${BASE_URL}/watch?v=${videoId}&entries=${encodeURI(JSON.stringify(entries))}`,
    );

    copyMock.mockRestore();
  });
});
