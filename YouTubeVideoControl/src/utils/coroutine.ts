import EventEmitter from './EventEmitter/EventEmitter';
import EventEmitterHandlerSpecific from './EventEmitter/EventEmitterHandlerSpecific';

export const WATCHDOG_INTERVAL = 100;
export const WATCHDOG_TIMEOUT_LIMIT = 500;

export const SUBSTITUTE_INTERVAL = 1000 / 60; // 60 times per second

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

  // timestamp the first callback was done
  private _startTimestamp: number = -1;

  // time when start was called
  private _startTime: number = -1;

  // time when pause started
  private pauseStart: number = -1;

  // total time paused
  private pauseTime: number = 0;

  // timestamp of the last callback done
  private _lastCallbackTimestamp: number = -1;

  // total callback count
  private _callbackCount: number = 0;

  // last time callback was called
  private lastCallbackTime: number = -1;

  // watchdog that checks when requestAnimationFrame is paused
  private watchdog: NodeJS.Timer | null = null;

  // substitute that runs if requestAnimationFrame is paused
  private substitute: NodeJS.Timer | null = null;

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
    this.startWatchdog();
    this.state = CoroutineState.Running;
  }

  stop(): void {
    if (!this.stopped) {
      this.state = CoroutineState.Stopped;
      this.emitter.emit(EVENT_STOP);
      this.stopWatchdog();
      this.stopSubstitute();
    }
  }

  pause(): void {
    this.state = CoroutineState.Paused;
    this.pauseStart = performance.now();
    this.stopWatchdog();
    this.stopSubstitute();
  }

  private tick(timestamp: number): boolean {
    if (
      (this.timeout >= 0 && timestamp - this.startTimestamp >= this.timeout)
      || (this.callbackLimit >= 0 && this._callbackCount >= this.callbackLimit)
    ) {
      this.stop();
    }

    if (this.running) {
      if (
        this.interval < 0
        || this._lastCallbackTimestamp < 0
        || timestamp - this._lastCallbackTimestamp >= this.interval
      ) {
        this.callback(timestamp);
        this._callbackCount += 1;
        this._lastCallbackTimestamp = timestamp;
      }
    }

    return this.running;
  }

  private doCallback(timestamp: number): void {
    if (this._startTimestamp < 0) {
      this._startTimestamp = timestamp;
    }

    if (this.tick(timestamp)) {
      this.lastCallbackTime = performance.now();
      requestAnimationFrame(this.doCallback.bind(this));
    }
  }

  private startSubstitute() {
    if (!this.substitute) {
      const lastTime = this.lastCallbackTime;
      this.substitute = setInterval(() => {
        if (lastTime !== this.lastCallbackTime) {
          this.stopSubstitute();
          return;
        }

        this.tick(performance.now());
      }, SUBSTITUTE_INTERVAL);
    }
  }

  private stopSubstitute() {
    if (this.substitute) {
      clearInterval(this.substitute);
      this.substitute = null;
    }
  }

  private startWatchdog() {
    if (!this.watchdog) {
      this.watchdog = setInterval(() => {
        if (
          !this.substitute
          && performance.now() - this.lastCallbackTime >= WATCHDOG_TIMEOUT_LIMIT
        ) {
          this.startSubstitute();
        }
      }, WATCHDOG_INTERVAL);
    }
  }

  private stopWatchdog() {
    if (this.watchdog) {
      clearInterval(this.watchdog);
      this.watchdog = null;
    }
  }
}

export default Coroutine;
