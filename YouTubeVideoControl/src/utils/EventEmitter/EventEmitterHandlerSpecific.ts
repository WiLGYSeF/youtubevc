import EventEmitterHandler from './EventEmitterHandler';

class EventEmitterHandlerSpecific<T> {
  constructor(
    private handler: EventEmitterHandler<T>,
    private event: string,
  ) {}

  public on(listener: (value: T) => void): void {
    this.handler.on(this.event, listener);
  }

  public off(listener: (value: T) => void): boolean {
    return this.handler.off(this.event, listener);
  }

  public allOff(): void {
    this.handler.allOff(this.event);
  }

  public count(): number {
    return this.handler.count(this.event);
  }
}

export default EventEmitterHandlerSpecific;
