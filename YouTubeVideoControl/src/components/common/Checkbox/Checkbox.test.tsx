import React from 'react';
import { render } from '@testing-library/react';

import flatten from 'utils/flattenElements';
import Checkbox, { getInputs } from './Checkbox';

function getLabel(container: HTMLElement): HTMLElement {
  return container.querySelector('[data-testid="label"]') as HTMLElement;
}

describe('Checkbox', () => {
  let getIdInternalMock: jest.SpyInstance;

  beforeEach(() => {
    getIdInternalMock = jest.spyOn(Checkbox.prototype, 'getIdInternal')
      .mockImplementation(() => 'checkbox-test');
  });

  afterEach(() => {
    getIdInternalMock.mockRestore();
  });

  it('renders label', () => {
    const { container } = render(<Checkbox
      label="test label"
      onChange={() => {}}
    />);

    const label = getLabel(container);
    const { checkbox } = getInputs(container);

    const flattened = flatten(container);

    expect(flattened.indexOf(checkbox)).toBeLessThan(flattened.indexOf(label));
  });

  it('renders label on left', () => {
    const { container } = render(<Checkbox
      label="test label"
      labelLeft
      onChange={() => {}}
    />);

    const label = getLabel(container);
    const { checkbox } = getInputs(container);

    const flattened = flatten(container);

    expect(flattened.indexOf(label)).toBeLessThan(flattened.indexOf(checkbox));
  });

  it('renders checked', () => {
    const { container } = render(<Checkbox
      label="test label"
      onChange={() => {}}
      defaultChecked
    />);

    const { checkbox } = getInputs(container);

    expect(checkbox.checked).toBeTruthy();
  });

  it('renders unchecked', () => {
    const { container } = render(<Checkbox
      label="test label"
      onChange={() => {}}
      defaultChecked={false}
    />);

    const { checkbox } = getInputs(container);

    expect(checkbox.checked).toBeFalsy();
  });

  it('sends value on change', () => {
    let result = false;
    const testFn = jest.fn();

    const { container } = render(<Checkbox
      label="test label"
      onChange={(checked: boolean) => {
        result = checked;
        testFn(checked);
      }}
    />);

    const { checkbox } = getInputs(container);

    expect(checkbox.checked).toBeFalsy();
    expect(result).toBeFalsy();

    checkbox.click();

    expect(checkbox.checked).toBeTruthy();
    expect(result).toBeTruthy();

    checkbox.click();

    expect(checkbox.checked).toBeFalsy();
    expect(result).toBeFalsy();

    expect(testFn.mock.calls.map((x) => x[0])).toEqual([true, false]);
  });

  it('updates value on props change', () => {
    let checked = false;
    const { container, rerender } = render(<Checkbox
      label="test label"
      defaultChecked={checked}
      onChange={() => {}}
    />);

    const { checkbox } = getInputs(container);

    expect(checkbox.checked).toBeFalsy();

    checked = true;
    rerender(<Checkbox
      label="test label"
      defaultChecked={checked}
      onChange={() => {}}
    />);

    expect(checkbox.checked).toBeTruthy();
  });
});

describe('Checkbox getIdInternal', () => {
  it('getIdInternal', () => {
    expect(Checkbox.prototype.getIdInternal()).toMatch(/^checkbox-[A-Za-z0-9]+$/);
  });
});
