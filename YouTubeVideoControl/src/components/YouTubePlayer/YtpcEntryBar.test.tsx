import React from 'react';
import renderer from 'react-test-renderer';

import YtpcEntryBar from './YtpcEntryBar';

describe('YtpcEntryBar', () => {
  it('renders', () => {
    const component = renderer.create(<YtpcEntryBar />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
