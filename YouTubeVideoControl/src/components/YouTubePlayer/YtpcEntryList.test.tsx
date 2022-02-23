import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import { getFiberNodeName } from 'utils/test/fiberNode';
import YtpcEntryList from './YtpcEntryList';

describe('YtpcEntryList', () => {
  it('renders entries', () => {
    const entries = [
      new YtpcGotoEntry(0, 0),
      new YtpcGotoEntry(5, 0),
      new YtpcGotoEntry(8, 0),
    ];

    const component = renderer.create(<YtpcEntryList
      entries={entries}
      deleteEntry={() => {}}
      editEntry={() => {}}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it.each([
    [0],
    [2],
    [3],
  ])(
    'renders entries with bar at index %d',
    (barIndex: number) => {
      const entries = [
        new YtpcGotoEntry(0, 0),
        new YtpcGotoEntry(5, 0),
        new YtpcGotoEntry(8, 0),
      ];

      const { container } = render(<YtpcEntryList
        entries={entries}
        barIndex={barIndex}
        deleteEntry={() => {}}
        editEntry={() => {}}
      />);

      const children = container.getElementsByClassName('entry-list')[0].childNodes;
      let idx = 0;

      for (; idx < barIndex; idx += 1) {
        expect(getFiberNodeName(children[idx])).toEqual('YtpcEntry');
      }

      expect(getFiberNodeName(children[idx])).toEqual('YtpcEntryBar');
      idx += 1;

      for (; idx < children.length; idx += 1) {
        expect(getFiberNodeName(children[idx])).toEqual('YtpcEntry');
      }
    },
  );
});
