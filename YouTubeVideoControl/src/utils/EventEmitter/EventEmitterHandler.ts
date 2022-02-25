class EventEmitterHandler<T> {
  protected eventListeners = new Map<string, Set<(value: T) => void>>();

  public on(event: string, listener: (value: T) => void): void {
    let listenerSet = this.eventListeners.get(event);

    if (!listenerSet) {
      listenerSet = new Set();
      this.eventListeners.set(event, listenerSet);
    }

    listenerSet.add(listener);
  }

  public off(event: string, listener: (value: T) => void): boolean {
    return this.eventListeners.get(event)?.delete(listener) ?? false;
  }

  public allOff(event?: string): void {
    if (event === undefined) {
      this.eventListeners.forEach((set) => {
        set.clear();
      });
    } else {
      this.eventListeners.get(event)?.clear();
    }
  }

  public count(event?: string): number {
    let total = 0;

    if (event === undefined) {
      this.eventListeners.forEach((set) => {
        total += set.size;
      });
    } else {
      total = this.eventListeners.get(event)?.size ?? 0;
    }

    return total;
  }
}

export default EventEmitterHandler;
