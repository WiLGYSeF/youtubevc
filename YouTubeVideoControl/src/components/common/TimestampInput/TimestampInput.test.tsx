import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimestampInput, { getInputs } from './TimestampInput';

describe('TimestampInput', () => {
  it('renders with string input', () => {
    const { container } = render(<TimestampInput
      defaultValue="27:51"
      onChange={() => {}}
    />);

    const input = container.getElementsByTagName('input')[0];
    expect(input.value).toEqual('27:51');
  });

  it('renders with number input', () => {
    const { container } = render(<TimestampInput
      defaultValue={3607}
      onChange={() => {}}
    />);

    const { input } = getInputs(container);
    expect(input.value).toEqual('01:00:07');
  });

  it.each([
    ['1:39', [1, 1, 60 + 3, 60 + 39], ['1', '1:', '1:3', '1:39', '01:39']],
    ['10:23:45', [
      1, 10, 10,
      10 * 60 + 2, 10 * 60 + 23, 10 * 60 + 23,
      10 * 60 * 60 + 23 * 60 + 4, 10 * 60 * 60 + 23 * 60 + 45,
    ], ['1', '10', '10:', '10:2', '10:23', '10:23:', '10:23:4', '10:23:45', '10:23:45']],
    ['0:71', [0, 0, 7, 71], ['0', '0:', '0:7', '0:71', '01:11']],
    ['00:12.3', [0, 0, 0, 1, 12, 12, 12.3], ['0', '00', '00:', '00:1', '00:12', '00:12.', '00:12.3', '00:12.3']],
    ['00:123', [0, 0, 0, 1, 12, 12], ['0', '00', '00:', '00:1', '00:12', '00:12', '00:12']],
  ])(
    'inputs "%s"',
    (inputStr: string, expected: number[], expectedStr: string[]) => {
      let testValue = 0;
      const testChangeFn = jest.fn();
      const testInputFn = jest.fn();

      const { container } = render(<TimestampInput
        defaultValue={0}
        onChange={(value: number) => {
          testValue = value;
          testChangeFn(value);
        }}
        setInput={(value: string) => {
          testInputFn(value);
        }}
      />);

      const { input } = getInputs(container);

      userEvent.clear(input);

      testChangeFn.mockClear();
      testInputFn.mockClear();

      for (let i = 0; i < inputStr.length; i += 1) {
        userEvent.keyboard(inputStr[i]);
        expect(testValue).toEqual(expected[i]);
      }

      fireEvent.blur(input);

      expect(testChangeFn.mock.calls.map((x) => x[0])).toEqual(expected);
      expect(testInputFn.mock.calls.map((x) => x[0])).toEqual(expectedStr);
    },
  );

  it('forces update on enter', () => {
    const testFn = jest.fn();

    const { container } = render(<TimestampInput
      defaultValue="0:71"
      onChange={() => {}}
      setInput={testFn}
    />);

    const { input } = getInputs(container);

    expect(input.value).toEqual('01:11');

    userEvent.clear(input);
    userEvent.type(input, '00:03{enter}');
    expect(input.value).toEqual('00:03');

    userEvent.clear(input);
    testFn.mockClear();
    userEvent.type(input, '15{enter}');
    expect(input.value).toEqual('00:15');
    expect(testFn.mock.calls.map((x) => x[0])).toEqual(['1', '15', '00:15']);
  });

  it('updates value on props change', () => {
    let value = 5;

    const { container, rerender } = render(<TimestampInput
      defaultValue={value}
      onChange={() => {}}
    />);

    const { input } = getInputs(container);

    expect(input.value).toEqual('00:05');

    value = 17;
    rerender(<TimestampInput
      defaultValue={value}
      onChange={() => {}}
    />);

    expect(input.value).toEqual('00:17');
  });
});
