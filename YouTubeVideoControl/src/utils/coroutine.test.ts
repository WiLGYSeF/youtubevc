import Coroutine from './coroutine';

describe('coroutine', () => {
  const mockRequestAnimationFrame = () => jest.spyOn(window, 'requestAnimationFrame')
    .mockImplementation(() => 0);

  const doCallback = (routine: Coroutine, timestamp: number): void => {
    // dot notation is not used because doCallback is private and causes an error in typescript
    // eslint-disable-next-line @typescript-eslint/dot-notation
    routine['doCallback'](timestamp);
  };

  it('runs callback', () => {
    const raf = mockRequestAnimationFrame();

    const start = 0;
    const total = 3;

    const func = jest.fn();
    const routine = new Coroutine(func);

    routine.start();
    for (let time = start; time < total; time += 1) {
      doCallback(routine, time);
    }
    routine.stop();
    doCallback(routine, total);

    expect(func).toBeCalledTimes(total);
    expect(routine.startTime).toBe(start);
    expect(routine.lastCallbackTime).toBe(total - 1);
    expect(routine.callbackCount).toBe(total);
    raf.mockRestore();
  });

  it('runs callback to timeout', () => {
    const raf = mockRequestAnimationFrame();

    const start = 0;
    const timeout = 5;

    const func = jest.fn();
    const routine = new Coroutine(func, timeout);

    routine.start();
    for (let time = start; time < timeout + 3; time += 1) {
      doCallback(routine, time);
    }
    routine.stop();

    expect(func).toBeCalledTimes(timeout);
    expect(routine.startTime).toBe(start);
    expect(routine.lastCallbackTime).toBe(timeout - 1);
    expect(routine.callbackCount).toBe(timeout);
    raf.mockRestore();
  });

  it('runs callback at interval', () => {
    const raf = mockRequestAnimationFrame();

    const start = 1;
    const total = 3;

    const func = jest.fn();
    const routine = new Coroutine(func, -1, 3);

    routine.start();
    for (let time = start; time < 10; time += 1) {
      doCallback(routine, time);
    }
    routine.stop();

    expect(func).toBeCalledTimes(total);
    expect(routine.startTime).toBe(start);
    expect(routine.lastCallbackTime).toBe(7);
    expect(routine.callbackCount).toBe(total);
    raf.mockRestore();
  });

  it('runs callback until limit', () => {
    const raf = mockRequestAnimationFrame();

    const start = 0;
    const total = 3;

    const func = jest.fn();
    const routine = new Coroutine(func, -1, -1, total);

    routine.start();
    for (let time = start; time < 10; time += 1) {
      doCallback(routine, time);
    }
    routine.stop();

    expect(func).toBeCalledTimes(total);
    expect(routine.startTime).toBe(start);
    expect(routine.lastCallbackTime).toBe(total - 1);
    expect(routine.callbackCount).toBe(total);
    raf.mockRestore();
  });

  it('stops when stop is called in callback', () => {
    const raf = mockRequestAnimationFrame();

    const start = 0;
    const total = 3;

    const routine = new Coroutine(() => {
      routine.stop();
    });

    routine.start();
    for (let time = start; time < total; time += 1) {
      doCallback(routine, time);
    }
    routine.stop();

    expect(routine.startTime).toBe(start);
    expect(routine.lastCallbackTime).toBe(start);
    expect(routine.callbackCount).toBe(1);
    raf.mockRestore();
  });
});
