import EventEmitterHandler from './EventEmitterHandler';

class EventEmitter<T> extends EventEmitterHandler<T> {
  public emit(event: string, value: T): void {
    this.eventListeners.get(event)?.forEach((listener) => {
      listener(value);
    });
  }
}

export default EventEmitter;
