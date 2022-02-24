import Coroutine from './coroutine';
import sleep from './sleep';

const TIMEDIFF_THRESHOLD = 20;

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
    expect(performance.now() - routine.startTime).toBeLessThan(TIMEDIFF_THRESHOLD);

    for (let time = start; time < total; time += 1) {
      expect(routine.running).toBeTruthy();
      doCallback(routine, time);
    }
    routine.stop();
    doCallback(routine, total);

    expect(func).toBeCalledTimes(total);
    expect(routine.running).toBeFalsy();
    expect(routine.startTimestamp).toEqual(start);
    expect(routine.lastCallbackTimestamp).toEqual(total - 1);
    expect(routine.callbackCount).toEqual(total);
    raf.mockRestore();
  });

  it('runs until timeout', () => {
    const raf = mockRequestAnimationFrame();

    const start = 0;
    const timeout = 5;

    const func = jest.fn();
    const routine = new Coroutine(func, timeout);

    routine.start();
    for (let time = start; time < timeout + 3; time += 1) {
      expect(routine.running).toEqual(time <= timeout);
      expect(routine.stopped).toEqual(time > timeout);
      doCallback(routine, time);
    }
    routine.stop();

    expect(func).toBeCalledTimes(timeout);
    expect(routine.lastCallbackTimestamp).toEqual(timeout - 1);
    expect(routine.callbackCount).toEqual(timeout);
    raf.mockRestore();
  });

  it('runs at interval', () => {
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

    expect(routine.lastCallbackTimestamp).toEqual(7);
    expect(routine.callbackCount).toEqual(total);
    raf.mockRestore();
  });

  it('runs until limit', () => {
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
    expect(routine.lastCallbackTimestamp).toEqual(total - 1);
    expect(routine.callbackCount).toEqual(total);
    raf.mockRestore();
  });

  it('stops when stopped in callback', () => {
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

    expect(routine.startTimestamp).toEqual(start);
    expect(routine.lastCallbackTimestamp).toEqual(start);
    expect(routine.callbackCount).toEqual(1);
    raf.mockRestore();
  });

  it('pauses and resumes', async () => {
    const raf = mockRequestAnimationFrame();

    const routine = new Coroutine(() => {});

    const wait = 50;

    routine.start();
    const initialStart = routine.startTime;
    doCallback(routine, 0);
    routine.start();

    await sleep(wait);
    routine.pause();
    expect(routine.paused).toBeTruthy();
    doCallback(routine, wait);

    await sleep(wait);
    routine.start();
    doCallback(routine, wait * 2);

    await sleep(wait);
    routine.stop();
    doCallback(routine, wait * 3);

    expect(routine.startTime).toEqual(initialStart);
    expect(routine.runningTime - wait * 2).toBeLessThan(TIMEDIFF_THRESHOLD * 2);
    expect(routine.callbackCount).toEqual(2);
    raf.mockRestore();
  });
});
