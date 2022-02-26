import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import Checkbox from './Checkbox';

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
    const component = renderer.create(<Checkbox
      label="test label"
      onChange={() => {}}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders label on left', () => {
    const component = renderer.create(<Checkbox
      label="test label"
      labelLeft
      onChange={() => { }}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders checked', () => {
    const component = renderer.create(<Checkbox
      label="test label"
      onChange={() => { }}
      defaultChecked
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders unchecked', () => {
    const component = renderer.create(<Checkbox
      label="test label"
      onChange={() => { }}
      defaultChecked={false}
    />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
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

    const checkbox = container.getElementsByTagName('input')[0];

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

    const checkbox = container.getElementsByTagName('input')[0];

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
