import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ControlType } from 'objects/YtpcEntry/YouTubePlayerControllerEntry';
import YtpcControlSelect from './YtpcControlSelect';
import YtpcInput360 from './YtpcInput360';
import YtpcInputGoto from './YtpcInputGoto';
import YtpcInputLoop from './YtpcInputLoop';
import YtpcInputPause from './YtpcInputPause';
import YtpcInputPlaybackRate from './YtpcInputPlaybackRate';
import YtpcInputVolume from './YtpcInputVolume';

describe('YtpcControlSelect', () => {
  it('shows all input options', () => {
    const component = renderer.create(<YtpcControlSelect
      is360Video={false}
      controlInputType={ControlType.Goto}
      setControlInput={() => {}}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it.each([
    [ControlType.ThreeSixty, YtpcInput360],
    [ControlType.Goto, YtpcInputGoto],
    [ControlType.Loop, YtpcInputLoop],
    [ControlType.Pause, YtpcInputPause],
    [ControlType.PlaybackRate, YtpcInputPlaybackRate],
    [ControlType.Volume, YtpcInputVolume],
  ])(
    'returns the %s input component',
    (controlType: ControlType, expected: Function) => {
      const setControlInputMock = jest.fn();

      const { container } = render(<YtpcControlSelect
        is360Video={false}
        controlInputType={ControlType.Goto}
        setControlInput={setControlInputMock}
      />);

      const select = container.getElementsByTagName('select')[0];

      setControlInputMock.mockClear();
      userEvent.selectOptions(select, controlType);

      expect(setControlInputMock.mock.calls[0][0]).toEqual(controlType);
      expect(setControlInputMock.mock.calls[0][1]).toEqual(expected);
    },
  );
});
