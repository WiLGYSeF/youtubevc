import EventEmitter from './EventEmitter';
import EventEmitterHandlerSpecific from './EventEmitterHandlerSpecific';

describe('EventEmitter', () => {
  it('emits to listeners', () => {
    const EVENT_TEST = 'test';
    const EVENT_NOTRUN = 'not run';

    const emitter = new EventEmitter<number>();
    const testHandler = new EventEmitterHandlerSpecific<number>(emitter, EVENT_TEST);
    const notRunHandler = new EventEmitterHandlerSpecific<number>(emitter, EVENT_NOTRUN);

    const testFn1 = jest.fn();
    const testFn2 = jest.fn();
    const notRunFn1 = jest.fn();

    testHandler.on(testFn1);
    testHandler.on(testFn2);

    notRunHandler.on(notRunFn1);

    expect(emitter.count()).toEqual(3);
    expect(emitter.count(EVENT_TEST)).toEqual(2);
    expect(testHandler.count()).toEqual(2);
    expect(emitter.count('not existing')).toEqual(0);

    const emitData = 5600367;
    emitter.emit(EVENT_TEST, emitData);

    const listeners = [testFn1, testFn2];
    for (const listener of listeners) {
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(emitData);
    }

    expect(notRunFn1).not.toHaveBeenCalled();

    testHandler.off(testFn1);

    expect(emitter.count()).toEqual(2);
    expect(emitter.count(EVENT_TEST)).toEqual(1);
    expect(testHandler.count()).toEqual(1);

    testHandler.allOff();

    expect(emitter.count()).toEqual(1);
    expect(emitter.count(EVENT_TEST)).toEqual(0);
    expect(testHandler.count()).toEqual(0);

    expect(emitter.off('not existing', () => { })).toBeFalsy();
    expect(emitter.off(EVENT_TEST, () => { })).toBeFalsy();
    expect(emitter.count()).toEqual(1);

    emitter.allOff();

    expect(emitter.count()).toEqual(0);
  });
});
