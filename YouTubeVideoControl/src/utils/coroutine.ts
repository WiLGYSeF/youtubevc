export const MSEC_PER_SEC = 1000;

class Coroutine {
  public callback: (timestamp: number) => void;

  public timeout: number;
  public frequency: number;
  public callbackLimit: number;

  private stopped: boolean;

  private _startTime: number;
  private _lastCallbackTime: number;
  private _callbackCount: number;

  constructor(
    callback: (timestamp: number) => void,
    timeout?: number,
    frequency?: number,
    callbackLimit?: number,
  ) {
    this.callback = callback;

    this.timeout = timeout ?? -1;
    this.frequency = frequency ?? -1;
    this.callbackLimit = callbackLimit ?? -1;

    this.stopped = false;

    this._startTime = -1;
    this._lastCallbackTime = -1;
    this._callbackCount = 0;
  }

  get startTime() {
    return this._startTime;
  }

  get lastCallbackTime() {
    return this._lastCallbackTime;
  }

  get callbackCount() {
    return this._callbackCount;
  }

  start(): void {
    requestAnimationFrame(this.doCallback.bind(this));
  }

  stop(): void {
    this.stopped = true;
  }

  private doCallback(timestamp: number): void {
    if (this._startTime < 0) {
      this._startTime = timestamp;
    }

    if (
      (this.timeout < 0 || timestamp - this.startTime < this.timeout)
      && (
        this.frequency < 0
        || this._lastCallbackTime < 0
        || timestamp - this._lastCallbackTime >= this.frequency
      )
      && (this.callbackLimit < 0 || this._callbackCount < this.callbackLimit)
      && !this.stopped
    ) {
      this.callback(timestamp);
      this._callbackCount += 1;
      this._lastCallbackTime = timestamp;

      if (!this.stopped) {
        requestAnimationFrame(this.doCallback.bind(this));
      }
    }
  }
}

export default Coroutine;
