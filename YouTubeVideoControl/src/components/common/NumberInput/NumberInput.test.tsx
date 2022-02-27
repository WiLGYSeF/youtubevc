import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import flatten from 'utils/flattenElements';
import NumberInput from './NumberInput';

export interface NumberInputInputs {
  input: HTMLInputElement;
}

export function getInputs(container: HTMLElement): NumberInputInputs {
  return {
    input: container.querySelector('input')!,
  };
}

function getLabel(container: HTMLElement): HTMLElement {
  return container.querySelector('[data-testid="label"]') as HTMLElement;
}

describe('NumberInput', () => {
  it('renders label', () => {
    const { container } = render(<NumberInput
      label="test label"
      defaultValue={0}
      onChange={() => {}}
    />);

    const label = getLabel(container);
    const { input } = getInputs(container);

    const flattened = flatten(container);

    expect(flattened.indexOf(label)).toBeLessThan(flattened.indexOf(input));
  });

  it('renders label on right', () => {
    const { container } = render(<NumberInput
      label="test label"
      labelRight
      defaultValue={0}
      onChange={() => {}}
    />);

    const label = getLabel(container);
    const { input } = getInputs(container);

    const flattened = flatten(container);

    expect(flattened.indexOf(input)).toBeLessThan(flattened.indexOf(label));
  });

  it.each([
    // basic tests
    ['123', undefined, undefined, null, true, false, [1, 12, 123], '123'],
    ['1.23', undefined, undefined, null, true, false, [1, 1, 1.2, 1.23], '1.23'],
    ['-37', undefined, undefined, null, true, false, [NaN, -3, -37], '-37'],
    ['1az', undefined, undefined, null, true, false, [1, 1, 1], '1'],
    ['1.2.3', undefined, undefined, null, true, false, [1, 1, 1.2, 1.2, 1.23], '1.23'],

    // clamp tests
    ['123', 100, 120, null, true, false, [100, 100, 120], '123'],
    ['123', 100, 120, null, true, true, [100, 100, 120], '120'],
    ['123', undefined, 120, null, true, false, [1, 12, 120], '123'],
    ['123', undefined, 120, null, true, true, [1, 12, 120], '120'],

    // wrap tests
    ['1000', 0, 360, null, false, false, [1, 10, 100, 280], '1000'],
    ['1000', 0, 360, null, false, true, [1, 10, 100, 280], '280'],

    // step tests
    ['1.27', undefined, undefined, 0.1, true, false, [1, 1, 1.2, 1.3], '1.27'],
    ['1.27', undefined, undefined, 0.1, true, true, [1, 1, 1.2, 1.3], '1.3'],
  ])(
    'inputs "%s", [%d, %d] +%d clamp %d forceValue %d',
    (
      inputStr: string,
      minValue: number | undefined,
      maxValue: number | undefined,
      step: number | null,
      clamp: boolean,
      forceValue: boolean,
      expected: number[],
      expectedStr: string,
    ) => {
      let testValue = 0;
      const testFn = jest.fn();

      const { container } = render(<NumberInput
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        defaultValue={testValue}
        clamp={clamp}
        forceValue={forceValue}
        onChange={(value: number) => {
          testValue = value;
          testFn(value);
        }}
      />);

      const { input } = getInputs(container);

      expect(input.value).toEqual(testValue.toString());

      userEvent.clear(input);
      testFn.mockClear();

      for (let i = 0; i < inputStr.length; i += 1) {
        userEvent.keyboard(inputStr[i]);
        expect(testValue).toEqual(expected[i]);
      }

      fireEvent.blur(input);

      expect(input.value).toEqual(expectedStr);
      expect(testValue).toEqual(expected[expected.length - 1]);

      expect(testFn.mock.calls.map((x) => x[0])).toEqual(expected);
    },
  );

  it('forces update on enter', () => {
    const { container } = render(<NumberInput
      minValue={1}
      maxValue={10}
      defaultValue={15}
      clamp
      forceValue
      onChange={() => {}}
    />);

    const { input } = getInputs(container);

    expect(input.value).toEqual('15');

    userEvent.clear(input);
    userEvent.type(input, '3{enter}');
    expect(input.value).toEqual('3');

    userEvent.clear(input);
    userEvent.type(input, '15{enter}');
    expect(input.value).toEqual('10');
  });

  it('updates value on props change', () => {
    let value = 5;

    const { container, rerender } = render(<NumberInput
      minValue={1}
      maxValue={20}
      defaultValue={value}
      clamp
      forceValue
      onChange={() => { }}
    />);

    const { input } = getInputs(container);

    expect(input.value).toEqual(value.toString());

    value = 17;
    rerender(<NumberInput
      minValue={1}
      maxValue={20}
      defaultValue={value}
      clamp
      forceValue
      onChange={() => { }}
    />);

    expect(input.value).toEqual(value.toString());
  });
});
