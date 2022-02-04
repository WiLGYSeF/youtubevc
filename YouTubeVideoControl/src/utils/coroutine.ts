export const MSEC_PER_SEC = 1000;

class Coroutine {
  public callback: (timestamp: number) => void;

  public timeout?: number;
  public frequency?: number;

  private stopped: boolean;

  private _startTime: number;
  private _lastCallbackTime: number;

  constructor(callback: (timestamp: number) => void, timeout?: number, frequency?: number) {
    this.callback = callback;

    this.timeout = timeout;
    this.frequency = frequency;

    this.stopped = false;

    this._startTime = 0;
    this._lastCallbackTime = 0;
  }

  get startTime() {
    return this._startTime;
  }

  get lastCallbackTime() {
    return this._lastCallbackTime;
  }

  start() {
    requestAnimationFrame(this.doCallback.bind(this));
    this._startTime = 0;
  }

  stop() {
    this.stopped = true;
  }

  private doCallback(timestamp: number) {
    if (!this._startTime) {
      this._startTime = timestamp;
    }

    if (!this.timeout || timestamp - this.startTime < this.timeout) {
      if (!this.frequency || timestamp - this._lastCallbackTime > this.frequency) {
        this.callback(timestamp);
        this._lastCallbackTime = timestamp;

        if (!this.stopped) {
          requestAnimationFrame(this.doCallback.bind(this));
        }
      }
    }
  }
}

export default Coroutine;
