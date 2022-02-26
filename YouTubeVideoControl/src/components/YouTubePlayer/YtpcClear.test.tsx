import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import YtpcClear from './YtpcClear';

export interface YtpcClearInputs {
  clear: HTMLElement;
}

export function getInputs(container: HTMLElement): YtpcClearInputs {
  return {
    clear: container.querySelector('.clear')!,
  };
}

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
