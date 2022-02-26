import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import YtpcAdd from './YtpcAdd';

export interface YtpcAddInputs {
  add: HTMLElement;
}

export function getInputs(container: HTMLElement): YtpcAddInputs {
  return {
    add: container.querySelector('.add')!,
  };
}

describe('YtpcAdd', () => {
  it('calls create entry on click', () => {
    const createEntry = jest.fn();

    const { container } = render(<YtpcAdd
      createEntry={createEntry}
    />);

    const { add } = getInputs(container);

    userEvent.click(add);
    expect(createEntry).toHaveBeenCalledTimes(1);
  });
});
