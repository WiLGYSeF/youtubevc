import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcControlSelect, { getControlTypes, getInputs, isControlDisabledIfNot360Video } from './YtpcControlSelect';

describe('YtpcControlSelect', () => {
  it('shows all input options', () => {
    const { container } = render(<YtpcControlSelect
      is360Video
      defaultControlType={ControlType.Goto}
      setControlInput={() => {}}
    />);

    const { select } = getInputs(container);
    const options = Array.from(select.getElementsByTagName('option'));

    expect(options.map((opt) => opt.value)).toEqual(
      getControlTypes().map(([type]) => type),
    );
  });

  it.each(
    getControlTypes(),
  )(
    'returns the %s input component',
    (controlType: ControlType, expected: Function) => {
      const setControlInputMock = jest.fn();

      const { container } = render(<YtpcControlSelect
        is360Video
        defaultControlType={ControlType.Goto}
        setControlInput={setControlInputMock}
      />);

      const { select } = getInputs(container);

      setControlInputMock.mockClear();
      userEvent.selectOptions(select, controlType);

      expect(setControlInputMock.mock.calls[0][0]).toEqual(controlType);
      expect(setControlInputMock.mock.calls[0][1]).toEqual(expected);

      expect(select.value).toEqual(controlType);
    },
  );

  it.each(
    getControlTypes(),
  )(
    'returns the %s input component when not 360 video',
    (controlType: ControlType, expected: Function) => {
      const setControlInputMock = jest.fn();

      const { container } = render(<YtpcControlSelect
        is360Video={false}
        defaultControlType={ControlType.Goto}
        setControlInput={setControlInputMock}
      />);

      const { select } = getInputs(container);

      setControlInputMock.mockClear();
      userEvent.selectOptions(select, controlType);

      if (!isControlDisabledIfNot360Video(controlType)) {
        expect(setControlInputMock.mock.calls[0][0]).toEqual(controlType);
        expect(setControlInputMock.mock.calls[0][1]).toEqual(expected);

        expect(select.value).toEqual(controlType);
      } else {
        expect(setControlInputMock).not.toHaveBeenCalled();
      }
    },
  );

  it('updates value on props change', () => {
    let controlType = ControlType.Goto;
    const setControlInputMock = jest.fn();

    const { container, rerender } = render(<YtpcControlSelect
      is360Video
      defaultControlType={controlType}
      setControlInput={setControlInputMock}
    />);

    const { select } = getInputs(container);

    expect(select.value).toEqual(controlType);

    controlType = ControlType.Loop;

    rerender(<YtpcControlSelect
      is360Video
      defaultControlType={controlType}
      setControlInput={setControlInputMock}
    />);

    expect(select.value).toEqual(controlType);
  });
});
