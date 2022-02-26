import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcGotoEntry from 'objects/YtpcEntry/YtpcGotoEntry';
import YtpcEntry from './YtpcEntry';

export function getInputs(container: HTMLElement): ({
  edit: HTMLElement,
  eDelete: HTMLElement,
}) {
  return {
    edit: container.querySelector('.edit')!,
    eDelete: container.querySelector('.delete')!,
  };
}

describe('YtpcEntry', () => {
  it('edits the entry on click', () => {
    const entry = YtpcGotoEntry.fromState({
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    });
    const deleteEntry = jest.fn();
    const editEntry = jest.fn();

    const { container } = render(<YtpcEntry
      entry={entry}
      deleteEntry={deleteEntry}
      editEntry={editEntry}
    />);

    const { edit } = getInputs(container);

    userEvent.click(edit);
    expect(editEntry).toHaveBeenCalledTimes(1);
  });

  it('deletes the entry on click', () => {
    const entry = YtpcGotoEntry.fromState({
      atTime: 0,
      controlType: ControlType.Goto,
      gotoTime: 0,
    });
    const deleteEntry = jest.fn();
    const editEntry = jest.fn();

    const { container } = render(<YtpcEntry
      entry={entry}
      deleteEntry={deleteEntry}
      editEntry={editEntry}
    />);

    const { eDelete } = getInputs(container);

    userEvent.click(eDelete);
    expect(deleteEntry).toHaveBeenCalledTimes(1);
  });
});
