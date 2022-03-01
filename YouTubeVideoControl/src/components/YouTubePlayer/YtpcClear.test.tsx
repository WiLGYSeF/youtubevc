import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import YtpcClear, { getInputs } from './YtpcClear';

describe('YtpcClear', () => {
  it('clears entries on click', () => {
    const clearEntries = jest.fn();

    const { container } = render(<YtpcClear
      clearEntries={clearEntries}
    />);

    const { clear } = getInputs(container);

    userEvent.click(clear);
    expect(clearEntries).toHaveBeenCalledTimes(1);
  });
});
