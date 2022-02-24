import sleep from './sleep';

const TIMEDIFF_THRESHOLD = 20;

describe('sleep', () => {
  it.each([
    [150],
  ])(
    'sleeps for %d ms',
    async (msec: number) => {
      const start = performance.now();
      await sleep(msec);
      expect(Math.abs((performance.now() - start) - msec)).toBeLessThan(TIMEDIFF_THRESHOLD);
    },
  );
});
