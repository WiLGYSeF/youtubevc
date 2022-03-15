import React from 'react';
import { act, render } from '@testing-library/react';

import Card from './Card';
import flatten from '../../utils/flattenElements';

function mockMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

describe('Card', () => {
  it('renders content on left', () => {
    mockMatchMedia();

    const { container } = render(<Card
      header="a"
      contents={['b', 'c']}
      imageSrc="d"
      imageAlt="e"
      contentOnLeft={true}
    />);

    const flattened = flatten(container);

    const idxContent = flattened.findIndex((e) => e.classList.contains('content'));
    const idxImage = flattened.findIndex((e) => e.classList.contains('image'));

    const contents = container.querySelector('.contents')!;

    expect(idxContent).toBeLessThan(idxImage);
    expect(contents.children.length).toEqual(2);
  });

  it('renders content on right', () => {
    mockMatchMedia();

    const { container } = render(<Card
      header="a"
      contents={['b', 'c']}
      imageSrc="d"
      imageAlt="e"
      contentOnLeft={false}
    />);

    const flattened = flatten(container);

    const idxContent = flattened.findIndex((e) => e.classList.contains('content'));
    const idxImage = flattened.findIndex((e) => e.classList.contains('image'));

    expect(idxContent).toBeGreaterThan(idxImage);
  });
});
