import React from 'react';
import { render } from '@testing-library/react';

import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import mockI18n from 'utils/test/i18nMock';
import YtpcExport, { ExportType, LINE_ENDING } from './YtpcExport';

jest.mock('react-i18next', () => mockI18n());

describe('YtpcExport', () => {
  it('exports entries to file as JSON', async () => {
    const saveAsMock = jest.spyOn(YtpcExport.prototype, 'saveAs')
      .mockImplementation();

    const filename = 'test-file';
    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];

    const { container } = render(<YtpcExport
      filename={filename}
      entries={entries}
      exportType={ExportType.Json}
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    expect(saveAsMock.mock.calls[0][1]).toEqual(filename);

    const blob = saveAsMock.mock.calls[0][0] as Blob;
    const blobContent = await (new Response(blob)).text();

    expect(blobContent).toEqual(JSON.stringify(entries, null, 2));

    saveAsMock.mockRestore();
  });

  it('exports entries to file as text', async () => {
    const saveAsMock = jest.spyOn(YtpcExport.prototype, 'saveAs')
      .mockImplementation();

    const filename = 'test-file';
    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];

    const { container } = render(<YtpcExport
      filename={filename}
      entries={entries}
      exportType={ExportType.Text}
    />);

    const button = container.getElementsByTagName('button')[0];
    button.click();

    expect(saveAsMock.mock.calls[0][1]).toEqual(filename);

    const blob = saveAsMock.mock.calls[0][0] as Blob;
    const blobContent = await (new Response(blob)).text();

    expect(blobContent).toEqual(entries.map((e) => e.toString()).join(LINE_ENDING) + LINE_ENDING);

    saveAsMock.mockRestore();
  });
});
