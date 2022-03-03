import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import YouTubePlayerControllerEntry, { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcLoopEntry from 'objects/YtpcEntry/YtpcLoopEntry';
import { secondsToTimestamp } from 'utils/timestr';
import { PLAYBACK_RATES } from 'utils/youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
import YouTubePlayerController, {
  performEntryActions,
  addEntry, filterLoopEntries, getInputs, getRandomLoopEntry,
} from './YouTubePlayerController';
import { getInputsByControl } from './YtpcInput/YtpcInput';
import { YtpcInputLoopInputs } from './YtpcInput/YtpcInputLoop';
import { YtpcInputGotoInputs } from './YtpcInput/YtpcInputGoto';
import { getInputs as entryGetInputs } from './YtpcEntry';
import { getEntries } from './YtpcEntryList';

function expectAscendingOrder(arr: any[], cmp: (a: any, b: any) => number): void {
  for (let i = 1; i < arr.length; i += 1) {
    expect(cmp(arr[i - 1], arr[i]) <= 0).toBeTruthy();
  }
}

function getEntryList(container: HTMLElement): HTMLElement {
  return container.querySelector('[data-testid="entry-list"]')!;
}

describe('YouTubePlayerController', () => {
  describe('addEntry', () => {
    it('adds entries in order', () => {
      const entries = [
        new YtpcGotoEntry(1, 12),
        new YtpcGotoEntry(2, 34),
        new YtpcLoopEntry(5, 3),
        new YtpcGotoEntry(10, 78),
      ];

      addEntry(entries, new YtpcGotoEntry(3, 0));
      addEntry(entries, new YtpcLoopEntry(11, 0));

      expect(entries.length).toEqual(6);
      expectAscendingOrder(
        entries,
        (a: YouTubePlayerControllerEntry, b: YouTubePlayerControllerEntry) => a.atTime - b.atTime,
      );
    });

    it('modifies existing entries', () => {
      const atTime = 5;
      const entries = [
        new YtpcGotoEntry(1, 12),
        new YtpcGotoEntry(2, 34),
        new YtpcGotoEntry(atTime, 3),
        new YtpcLoopEntry(10, 5),
      ];

      expect(
        (entries.find(
          (e) => e.controlType === ControlType.Goto && e.atTime === atTime,
        ) as YtpcGotoEntry).gotoTime,
      ).toEqual(3);

      addEntry(entries, new YtpcGotoEntry(atTime, 1));
      addEntry(entries, new YtpcLoopEntry(atTime, 0));

      expect(entries.length).toEqual(5);
      expect(
        (entries.find(
          (e) => e.controlType === ControlType.Goto && e.atTime === atTime,
        ) as YtpcGotoEntry
        ).gotoTime,
      ).toEqual(1);
      expectAscendingOrder(
        entries,
        (a: YouTubePlayerControllerEntry, b: YouTubePlayerControllerEntry) => a.atTime - b.atTime,
      );
    });
  });

  describe('getRandomLoopEntry', () => {
    const entries = [
      new YtpcLoopEntry(20, 10, 10),
      new YtpcLoopEntry(37, 21, 3),
      new YtpcGotoEntry(37.5, 0),
      new YtpcLoopEntry(42, 38, 2),
      new YtpcLoopEntry(51, 44, 3),
      new YtpcGotoEntry(53, 0),
      new YtpcLoopEntry(60, 55, 1),
    ];

    it('filters only loop entries', () => {
      for (const type of filterLoopEntries(entries).map((e) => e.controlType)) {
        expect(type).toEqual(ControlType.Loop);
      }
    });

    it.each([
      [0.5, false, 42],
      [0.15, false, 20],
      [0.85, false, 60],
      [0.5, true, 20],
      [0.15, true, 20],
      [0.85, true, 51],
    ])(
      'gets random entries',
      (random: number, weighted: boolean, expected: number) => {
        const randomMock = jest.spyOn(Math, 'random').mockImplementation(() => random);

        const entry = getRandomLoopEntry(entries, weighted);

        expect(entry.controlType).toEqual(ControlType.Loop);
        expect(entry.atTime).toEqual(expected);

        randomMock.mockRestore();
      },
    );
  });

  describe('performEntryActions', () => {
    const ytPlayer = {
      seekTo: jest.fn(),
    } as unknown as YouTubePlayer;

    it('performs entry actions', () => {
      const performActionMock = jest.spyOn(YtpcGotoEntry.prototype, 'performAction')
        .mockImplementation();

      const entries = [
        new YtpcGotoEntry(4, 10),
        new YtpcGotoEntry(15, 0),
      ];

      let lastMatchingIdx = 0;

      const doTest = (curTime: number, lastTime: number) => {
        performActionMock.mockClear();
        lastMatchingIdx = performEntryActions(ytPlayer, entries, curTime, lastTime, false, false);
      };

      for (let i = 0; i < entries[0].atTime; i += 0.1) {
        doTest(i - 0.1, i);
        expect(lastMatchingIdx).toEqual(-1);
        expect(performActionMock).toHaveBeenCalledTimes(0);
      }

      doTest(entries[0].atTime, entries[0].atTime - 0.1);
      expect(lastMatchingIdx).toEqual(0);
      expect(performActionMock).toHaveBeenCalledTimes(1);

      for (let i = 0; i < entries.length; i += 1) {
        doTest(entries[i].atTime + 0.005, entries[i].atTime - 0.005);
        expect(lastMatchingIdx).toEqual(i);
        expect(performActionMock).toHaveBeenCalledTimes(1);
      }

      doTest(entries[1].atTime - 0.005, entries[1].atTime - 0.01);
      expect(lastMatchingIdx).toEqual(0);
      expect(performActionMock).toHaveBeenCalledTimes(0);

      performActionMock.mockRestore();
    });

    it('performs multiple actions', () => {
      const performActionMock = jest.spyOn(YtpcGotoEntry.prototype, 'performAction')
        .mockImplementation();

      const entries = [
        new YtpcGotoEntry(15, 1),
        new YtpcGotoEntry(15.1, 0),
      ];

      const lastMatchingIdx = performEntryActions(
        ytPlayer,
        entries,
        entries[1].atTime,
        entries[0].atTime,
        false,
        false
      );

      expect(lastMatchingIdx).toEqual(1);
      expect(performActionMock).toHaveBeenCalledTimes(2);
      expect(performActionMock.mock.instances).toEqual(entries);

      performActionMock.mockRestore();
    });

    it('performs entry actions with loop shuffle', () => {
      const entries = [
        new YtpcLoopEntry(15, 0),
      ];

      let lastMatchingIdx = 0;

      const doTest = (curTime: number, lastTime: number) => {
        (ytPlayer.seekTo as jest.Mock).mockClear();
        lastMatchingIdx = performEntryActions(ytPlayer, entries, curTime, lastTime, true, false);
      };

      for (let i = 0; i < entries[0].atTime; i += 0.1) {
        doTest(i - 0.1, i);
        expect(lastMatchingIdx).toEqual(-1);
        expect(ytPlayer.seekTo).toHaveBeenCalledTimes(0);
      }

      doTest(entries[0].atTime, entries[0].atTime - 0.1);
      expect(lastMatchingIdx).toEqual(0);
      expect(ytPlayer.seekTo).toHaveBeenCalledTimes(1);

      for (let i = 0; i < entries.length; i += 1) {
        doTest(entries[i].atTime + 0.005, entries[i].atTime - 0.005);
        expect(lastMatchingIdx).toEqual(i);
        expect(ytPlayer.seekTo).toHaveBeenCalledTimes(1);
      }

      (ytPlayer.seekTo as jest.Mock).mockRestore();
    });
  });

  describe('YouTubePlayerController', () => {
    const getEntryObject = (
      entry: HTMLElement,
    ): YouTubePlayerControllerEntry => JSON.parse(entry.dataset.entry!);

    const ytPlayer = {
      addEventListener: jest.fn(),
      getAvailablePlaybackRates: jest.fn(() => PLAYBACK_RATES),
      getCurrentTime: jest.fn(),
      getVideoUrl: jest.fn(),
      removeEventListener: jest.fn(),
      seekTo: jest.fn(),
    } as unknown as YouTubePlayer;

    it('adds entries', () => {
      const { container } = render(<YouTubePlayerController
        ytPlayer={ytPlayer}
        entries=""
        loopShuffle={false}
        shuffleWeight={false}
      />);

      const { input } = getInputs(container);

      userEvent.clear(input.atTime.input);
      userEvent.type(input.atTime.input, '12:34');

      userEvent.selectOptions(input.controlSelect.select, ControlType.Loop);

      const {
        loopBackTo,
        forever,
        loopCount,
      } = getInputsByControl(input.controlInput, ControlType.Loop) as YtpcInputLoopInputs;

      userEvent.clear(loopBackTo.input);
      userEvent.type(loopBackTo.input, '56');

      userEvent.click(forever.checkbox);

      userEvent.clear(loopCount.input);
      userEvent.type(loopCount.input, '4');

      userEvent.click(input.add.add);

      const entryList = getEntryList(container);
      const entries = getEntries(entryList) as HTMLElement[];

      expect(entries.length).toEqual(1);
      expect(JSON.parse(entries[0].dataset.entry!)).toEqual({
        atTime: 754,
        controlType: ControlType.Loop,
        loopBackTo: 56,
        loopCount: 4,
        loopNum: 0,
      });
    });

    it('deletes entries', () => {
      const expected = [
        {
          atTime: 0,
          controlType: ControlType.Goto,
          gotoTime: 15,
        },
        {
          atTime: 10,
          controlType: ControlType.Goto,
          gotoTime: 25,
        },
        {
          atTime: 123,
          controlType: ControlType.Goto,
          gotoTime: 4,
        },
      ];

      const { container } = render(<YouTubePlayerController
        ytPlayer={ytPlayer}
        entries={JSON.stringify(expected)}
        loopShuffle={false}
        shuffleWeight={false}
      />);

      const entryList = container.querySelector('.entry-list')!;
      let entries = getEntries(entryList) as HTMLElement[];

      expect(entries.length).toEqual(3);
      expect(entries.map(getEntryObject)).toEqual(expected);

      const { eDelete } = entryGetInputs(entries[1]);

      userEvent.click(eDelete);
      expected.splice(1, 1);

      entries = getEntries(entryList) as HTMLElement[];

      expect(entries.length).toEqual(2);
      expect(entries.map(getEntryObject)).toEqual(expected);
    });

    it('edits an entry', () => {
      const expected = [
        {
          atTime: 0,
          controlType: ControlType.Goto,
          gotoTime: 15,
        },
        {
          atTime: 10,
          controlType: ControlType.Goto,
          gotoTime: 25,
        },
        {
          atTime: 15,
          controlType: ControlType.Loop,
          loopBackTo: 0,
          loopCount: 3,
        },
        {
          atTime: 123,
          controlType: ControlType.Goto,
          gotoTime: 4,
        },
        {
          atTime: 124,
          controlType: ControlType.Loop,
          loopBackTo: 20,
          loopCount: -1,
        },
      ];

      const tests = [
        {
          index: 1,
          controlType: ControlType.Goto,
        },
        {
          index: 3,
          controlType: ControlType.Goto,
        },
        {
          index: 2,
          controlType: ControlType.Loop,
        },
        {
          index: 4,
          controlType: ControlType.Loop,
        },
      ];

      const { container } = render(<YouTubePlayerController
        ytPlayer={ytPlayer}
        entries={JSON.stringify(expected)}
        loopShuffle={false}
        shuffleWeight={false}
      />);

      const { input } = getInputs(container);

      const entryList = container.querySelector('.entry-list')!;
      const entries = getEntries(entryList) as HTMLElement[];

      for (const test of tests) {
        const eEntry = entries[test.index];
        const entry = getEntryObject(eEntry);
        const { edit } = entryGetInputs(eEntry);

        userEvent.click(edit);

        expect(input.atTime.input.value).toEqual(secondsToTimestamp(entry.atTime));
        expect(input.controlSelect.select.value).toEqual(test.controlType);

        switch (test.controlType) {
          case ControlType.Goto: {
            const gotoEntry = entry as YtpcGotoEntry;
            const gotoInput = getInputsByControl(
              input.controlInput,
              ControlType.Goto
            ) as YtpcInputGotoInputs;

            expect(gotoInput.gotoTime.input.value)
              .toEqual(secondsToTimestamp(gotoEntry.gotoTime));
            break;
          }
          case ControlType.Loop: {
            const loopEntry = entry as YtpcLoopEntry;
            const loopInput = getInputsByControl(
              input.controlInput,
              ControlType.Loop
            ) as YtpcInputLoopInputs;

            expect(loopInput.loopBackTo.input.value)
              .toEqual(secondsToTimestamp(loopEntry.loopBackTo));
            expect(loopInput.forever.checkbox.checked).toEqual(loopEntry.loopCount < 0);
            expect(loopInput.loopCount.input.value).toEqual(loopEntry.loopCount.toString());
            break;
          }
          default:
            throw new Error('not implemented');
        }
      }
    });

    it('clears entries', () => {
      const expected = [
        {
          atTime: 0,
          controlType: ControlType.Goto,
          gotoTime: 15,
        },
        {
          atTime: 10,
          controlType: ControlType.Goto,
          gotoTime: 25,
        },
        {
          atTime: 123,
          controlType: ControlType.Goto,
          gotoTime: 4,
        },
      ];

      const { container } = render(<YouTubePlayerController
        ytPlayer={ytPlayer}
        entries={JSON.stringify(expected)}
        loopShuffle={false}
        shuffleWeight={false}
      />);

      const entryList = container.querySelector('.entry-list')!;
      let entries = getEntries(entryList) as HTMLElement[];

      const { clear } = getInputs(container);

      userEvent.click(clear.clear);

      entries = getEntries(entryList) as HTMLElement[];

      expect(entries.length).toEqual(0);
    });
  });
});
