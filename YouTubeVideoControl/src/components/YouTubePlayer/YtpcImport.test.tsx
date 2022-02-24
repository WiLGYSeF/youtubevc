import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcPauseEntry from 'objects/YtpcEntry/YtpcPauseEntry';
import sleep from 'utils/sleep';
import YtpcImport from './YtpcImport';
import { addEntry } from './YouTubePlayerController';

const IMPORT_POLL_TIMEOUT = 3000;
const IMPORT_POLL_TICK = 10;

async function pollUntil(
  condition: () => boolean,
  timeout: number,
  tick: number,
): Promise<boolean> {
  let conditionMet = condition();
  for (let total = 0; total < timeout && !conditionMet; total += tick) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(tick);
    conditionMet = condition();
  }
  return conditionMet;
}

describe('YtpcImport', () => {
  it('imports entries from JSON', async () => {
    const addEntryMock = jest.fn(addEntry);
    const setEntriesMock = jest.fn();

    let loaded = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onLoadMock = jest.fn((success: boolean) => {
      loaded = true;
    });

    const { container } = render(<YtpcImport
      addEntry={addEntryMock}
      setEntries={setEntriesMock}
      onLoad={onLoadMock}
    />);

    const input = container.getElementsByTagName('input')[0];

    const file = new File([String.raw`[
  {
    "controlType": "goto",
    "atTime": 0,
    "gotoTime": 1
  },
  {
    "controlType": "goto",
    "atTime": 3,
    "gotoTime": 6
  },
  {
    "controlType": "pause",
    "atTime": 30,
    "pauseTime": 1
  }
]`], 'test.json', { type: 'text/plain' });
    await userEvent.upload(input, file);

    await pollUntil(
      () => loaded,
      IMPORT_POLL_TIMEOUT,
      IMPORT_POLL_TICK,
    );

    expect(onLoadMock.mock.calls[0][0]).toBeTruthy();

    expect(addEntryMock).toHaveBeenCalledTimes(3);
    expect(setEntriesMock).toHaveBeenCalledTimes(1);

    expect(setEntriesMock.mock.calls[0][0]).toEqual([
      YtpcGotoEntry.fromState({
        controlType: ControlType.Goto,
        atTime: 0,
        gotoTime: 1,
      }),
      YtpcGotoEntry.fromState({
        controlType: ControlType.Goto,
        atTime: 3,
        gotoTime: 6,
      }),
      YtpcPauseEntry.fromState({
        controlType: ControlType.Pause,
        atTime: 30,
        pauseTime: 1,
      }),
    ]);
  });

  it('imports entries from text', async () => {
    const addEntryMock = jest.fn(addEntry);
    const setEntriesMock = jest.fn();

    let loaded = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onLoadMock = jest.fn((success: boolean) => {
      loaded = true;
    });

    const { container } = render(<YtpcImport
      addEntry={addEntryMock}
      setEntries={setEntriesMock}
      onLoad={onLoadMock}
    />);

    const input = container.getElementsByTagName('input')[0];

    const file = new File([String.raw`
At 00:00, go to 00:01
At 00:03, go to 00:06
invalid
At 00:30, pause for 1s
`], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);

    await pollUntil(
      () => loaded,
      IMPORT_POLL_TIMEOUT,
      IMPORT_POLL_TICK,
    );

    expect(onLoadMock.mock.calls[0][0]).toBeTruthy();

    expect(addEntryMock).toHaveBeenCalledTimes(3);
    expect(setEntriesMock).toHaveBeenCalledTimes(1);

    expect(setEntriesMock.mock.calls[0][0]).toEqual([
      YtpcGotoEntry.fromState({
        controlType: ControlType.Goto,
        atTime: 0,
        gotoTime: 1,
      }),
      YtpcGotoEntry.fromState({
        controlType: ControlType.Goto,
        atTime: 3,
        gotoTime: 6,
      }),
      YtpcPauseEntry.fromState({
        controlType: ControlType.Pause,
        atTime: 30,
        pauseTime: 1,
      }),
    ]);
  });

  it('handles invalid file', async () => {
    const addEntryMock = jest.fn(addEntry);
    const setEntriesMock = jest.fn();

    let loaded = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onLoadMock = jest.fn((success: boolean) => {
      loaded = true;
    });

    const { container } = render(<YtpcImport
      addEntry={addEntryMock}
      setEntries={setEntriesMock}
      onLoad={onLoadMock}
    />);

    const input = container.getElementsByTagName('input')[0];

    const file = new File([String.raw`
invalid
`], 'test.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);

    await pollUntil(
      () => loaded,
      IMPORT_POLL_TIMEOUT,
      IMPORT_POLL_TICK,
    );

    expect(onLoadMock.mock.calls[0][0]).toBeFalsy();

    expect(addEntryMock).toHaveBeenCalledTimes(0);
    expect(setEntriesMock).toHaveBeenCalledTimes(0);
  });
});
