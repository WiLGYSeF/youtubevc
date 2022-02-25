import EventEmitter from './EventEmitter/EventEmitter';
import EventEmitterHandlerSpecific from './EventEmitter/EventEmitterHandlerSpecific';

export const MSEC_PER_SEC = 1000;

enum CoroutineState {
  Unstarted,
  Running,
  Stopped,
  Paused,
}

const EVENT_STOP = 'stop';

class Coroutine {
  public callback: (timestamp: number) => void;

  public timeout: number;
  public interval: number;
  public callbackLimit: number;

  private state: CoroutineState;

  private emitter: EventEmitter<void>;
  private _stopEmitter: EventEmitterHandlerSpecific<void>;

  private _startTimestamp: number;
  private _startTime: number;
  private pauseStart: number;
  private pauseTime: number;

  private _lastCallbackTimestamp: number;
  private _callbackCount: number;

  constructor(
    callback: (timestamp: number) => void,
    timeout?: number,
    interval?: number,
    callbackLimit?: number,
  ) {
    this.callback = callback;

    this.timeout = timeout ?? -1;
    this.interval = interval ?? -1;
    this.callbackLimit = callbackLimit ?? -1;

    this.state = CoroutineState.Unstarted;

    this.emitter = new EventEmitter();
    this._stopEmitter = new EventEmitterHandlerSpecific(this.emitter, EVENT_STOP);

    this._startTimestamp = -1;
    this._startTime = -1;
    this.pauseStart = -1;
    this.pauseTime = 0;

    this._lastCallbackTimestamp = -1;
    this._callbackCount = 0;
  }

  get running() {
    return this.state === CoroutineState.Running;
  }

  get stopped() {
    return this.state === CoroutineState.Stopped;
  }

  get paused() {
    return this.state === CoroutineState.Paused;
  }

  get stopEmitter() {
    return this._stopEmitter;
  }

  get startTimestamp() {
    return this._startTimestamp;
  }

  get startTime() {
    return this._startTime;
  }

  get lastCallbackTimestamp() {
    return this._lastCallbackTimestamp;
  }

  get callbackCount() {
    return this._callbackCount;
  }

  get runningTime() {
    return performance.now() - this._startTime - this.pauseTime;
  }

  start(): void {
    switch (this.state) {
      case CoroutineState.Running:
        return;
      case CoroutineState.Paused:
        this.pauseTime += performance.now() - this.pauseStart;
        this.pauseStart = -1;
        break;
      case CoroutineState.Unstarted:
      case CoroutineState.Stopped:
      default:
        this._startTime = performance.now();
        break;
    }

    requestAnimationFrame(this.doCallback.bind(this));
    this.state = CoroutineState.Running;
  }

  stop(): void {
    if (!this.stopped) {
      this.state = CoroutineState.Stopped;
      this.emitter.emit(EVENT_STOP);
    }
  }

  pause(): void {
    this.state = CoroutineState.Paused;
    this.pauseStart = performance.now();
  }

  private doCallback(timestamp: number): void {
    if (this._startTimestamp < 0) {
      this._startTimestamp = timestamp;
    }

    if (
      (this.timeout >= 0 && timestamp - this.startTimestamp >= this.timeout)
      || (this.callbackLimit >= 0 && this._callbackCount >= this.callbackLimit)
    ) {
      this.stop();
    }

    if (
      this.running
      && (
        this.interval < 0
        || this._lastCallbackTimestamp < 0
        || timestamp - this._lastCallbackTimestamp >= this.interval
      )
    ) {
      this.callback(timestamp);
      this._callbackCount += 1;
      this._lastCallbackTimestamp = timestamp;

      if (this.running) {
        requestAnimationFrame(this.doCallback.bind(this));
      }
    }
  }
}

export default Coroutine;
