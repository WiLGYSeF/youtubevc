import trimstr from './trimstr';

describe('trimstr', () => {
  it.each([
    ['abc', ' ', 'abc'],
    ['  abc', ' ', 'abc'],
    ['abc   ', ' ', 'abc'],
    ['  abc    ', ' ', 'abc'],
    [' ab c ', ' ', 'ab c'],
  ])(
    'trims "%s" with "%s"',
    (str: string, char: string, expected: string) => {
      expect(trimstr(str, char)).toBe(expected);
    },
  );

  it.each([
    ['abc', ['=', '-'], 'abc'],
    ['-=abc=-', ['=', '-'], 'abc'],
    ['abc--', ['=', '-'], 'abc'],
    ['==abc', ['=', '-'], 'abc'],
    ['-=a-b-c=-', ['=', '-'], 'a-b-c'],
  ])(
    'trims "%s" with chars %j',
    (str: string, char: string[], expected: string) => {
      expect(trimstr(str, ...char)).toBe(expected);
    },
  );

  it.each([
    ['abc', ' a', 'abc'],
    ['   abc ', ' a', '   abc '],
  ])(
    'only trims "%s" with char inputs',
    (str: string, char: string, expected: string) => {
      expect(trimstr(str, char)).toBe(expected);
    },
  );
});
