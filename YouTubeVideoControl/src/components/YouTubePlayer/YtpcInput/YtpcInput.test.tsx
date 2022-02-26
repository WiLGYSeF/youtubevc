import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function getInputs(container: HTMLElement): ({
  nowTime: HTMLElement,
  atTime: HTMLInputElement,
}) {
  return {
    nowTime: container.querySelector('.now-time')!,
    atTime: container.querySelector('.at-time')!.getElementsByTagName('input')[0],
  };
}

describe('YtpcInput', () => {
  it('', () => {

  });
});
