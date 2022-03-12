import Coroutine, { SUBSTITUTE_INTERVAL, WATCHDOG_INTERVAL, WATCHDOG_TIMEOUT_LIMIT } from './coroutine';

describe('coroutine', () => {
  const requestAnimationFrameMock = () => jest.spyOn(window, 'requestAnimationFrame')
    .mockImplementation();

  const doCallback = (routine: Coroutine, timestamp: number): void => {
    // dot notation is not used because this is private
    // eslint-disable-next-line @typescript-eslint/dot-notation
    routine['doCallback'](timestamp);
  };

  it('runs callback', () => {
    const raf = requestAnimationFrameMock();

    const start = 0;
    const total = 3;

    const func = jest.fn();
    const routine = new Coroutine(func);

    routine.start();

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
    const raf = requestAnimationFrameMock();

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
    const raf = requestAnimationFrameMock();

    const start = 1;
    const total = 3;

    const func = jest.fn();
    const routine = new Coroutine(func, -1, 3);

    routine.start();
    for (let time = start; time < 10; time += 1) {
      expect(routine.running).toBeTruthy();
      doCallback(routine, time);
    }
    routine.stop();

    expect(func).toBeCalledTimes(total);

    expect(routine.lastCallbackTimestamp).toEqual(7);
    expect(routine.callbackCount).toEqual(total);
    raf.mockRestore();
  });

  it('runs until limit', () => {
    const raf = requestAnimationFrameMock();

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
    const raf = requestAnimationFrameMock();

    const start = 0;
    const total = 3;

    const routine = new Coroutine(() => {
      routine.stop();
    });

    const onStop = jest.fn();
    routine.stopEmitter.on(onStop);

    routine.start();
    for (let time = start; time < total; time += 1) {
      doCallback(routine, time);
    }
    routine.stop();

    expect(routine.startTimestamp).toEqual(start);
    expect(routine.lastCallbackTimestamp).toEqual(start);
    expect(routine.callbackCount).toEqual(1);

    expect(onStop).toHaveBeenCalledTimes(1);

    raf.mockRestore();
  });

  it('pauses and resumes', async () => {
    let time = 0;
    const wait = 50;

    const raf = requestAnimationFrameMock();
    const nowMock = jest.spyOn(performance, 'now').mockImplementation(() => time);

    const routine = new Coroutine(() => {});

    routine.start();
    const initialStart = routine.startTime;
    doCallback(routine, 0);
    routine.start();

    time += wait;
    routine.pause();
    expect(routine.paused).toBeTruthy();
    doCallback(routine, wait);

    time += wait;
    routine.start();
    doCallback(routine, wait * 2);

    time += wait;
    routine.stop();
    doCallback(routine, wait * 3);

    expect(routine.startTime).toEqual(initialStart);
    expect(routine.runningTime).toBe(wait * 2);
    expect(routine.callbackCount).toEqual(2);

    raf.mockRestore();
    nowMock.mockRestore();
  });

  it('starts substitute when requestAnimationFrame pauses', () => {
    let time = 0;

    // mocks performance.now() and requestAnimationFrame()!
    jest.useFakeTimers();

    const raf = requestAnimationFrameMock();

    const nowMock = jest.spyOn(performance, 'now').mockImplementation(() => time);
    const tickSpy = jest.spyOn(Coroutine.prototype as any, 'tick');
    const startSubstituteSpy = jest.spyOn(Coroutine.prototype as any, 'startSubstitute');

    const routine = new Coroutine(() => {});
    routine.start();

    // requestAnimationFrame callbacks

    doCallback(routine, time);
    time += 10;
    doCallback(routine, time);
    expect(tickSpy).toHaveBeenCalledTimes(2);

    tickSpy.mockClear();

    // pretend requestAnimationFrame has paused

    jest.advanceTimersByTime(WATCHDOG_INTERVAL);
    expect(startSubstituteSpy).toHaveBeenCalledTimes(0);

    time = WATCHDOG_TIMEOUT_LIMIT + 10;
    jest.advanceTimersByTime(WATCHDOG_INTERVAL);
    expect(startSubstituteSpy).toHaveBeenCalledTimes(1);

    // watchdog timer passed, start substitute and tick

    for (let i = 0; i < 5; i += 1) {
      time += SUBSTITUTE_INTERVAL;
      jest.advanceTimersByTime(SUBSTITUTE_INTERVAL);
      expect(tickSpy).toHaveBeenCalledTimes(i + 1);
    }

    tickSpy.mockClear();

    // pretend requestAnimationFrame has resumed

    doCallback(routine, time);
    expect(tickSpy).toHaveBeenCalledTimes(1);

    // make sure substitute has stopped
    time += SUBSTITUTE_INTERVAL;
    jest.advanceTimersByTime(SUBSTITUTE_INTERVAL);
    expect(tickSpy).toHaveBeenCalledTimes(1);

    raf.mockRestore();
    nowMock.mockRestore();

    jest.useRealTimers();
  });
});
