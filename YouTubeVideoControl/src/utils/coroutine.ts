export const MSEC_PER_SEC = 1000;

class Coroutine {
  public callback: (timestamp: number) => void;

  public timeout: number;
  public interval: number;
  public callbackLimit: number;

  private stopped: boolean;
  private _running: boolean;
  private _startTimestamp: number;
  private _startTime: number;
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

    this.stopped = false;
    this._running = false;
    this._startTimestamp = -1;
    this._startTime = performance.now();
    this._lastCallbackTimestamp = -1;
    this._callbackCount = 0;
  }

  get running() {
    return this._running;
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
    return performance.now() - this._startTime;
  }

  start(): void {
    requestAnimationFrame(this.doCallback.bind(this));
    this._running = true;
  }

  stop(): void {
    this.stopped = true;
    this._running = false;
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
      !this.stopped
      && (
        this.interval < 0
        || this._lastCallbackTimestamp < 0
        || timestamp - this._lastCallbackTimestamp >= this.interval
      )
    ) {
      this.callback(timestamp);
      this._callbackCount += 1;
      this._lastCallbackTimestamp = timestamp;

      if (!this.stopped) {
        requestAnimationFrame(this.doCallback.bind(this));
      }
    }
  }
}

export default Coroutine;
