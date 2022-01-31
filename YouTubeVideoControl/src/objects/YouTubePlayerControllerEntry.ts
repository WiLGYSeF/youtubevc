export enum ControlType {
  Goto = 'goto',
  Loop = 'loop',
  Volume = 'volume'
};

class YouTubePlayerControllerEntry {
  public controlType: ControlType;
  public atTime: number;

  constructor(controlType: ControlType, atTime: number) {
    this.controlType = controlType;
    this.atTime = atTime;
  }

  public getKey(): string {
    return `${this.controlType}-${this.atTime}`;
  }

  public toString(): string {
    let result = `At ${this.secondsToTime(this.atTime)}, `;
    let controlStr = '';

    switch (this.controlType) {
      case ControlType.Goto:
        controlStr = 'go to';
        break;
      case ControlType.Loop:
        controlStr = 'loop back to';
        break;
      case ControlType.Volume:
        controlStr = 'set volume to';
        break;
      default:
        throw TypeError();
    }

    result += controlStr;

    return result;
  }

  private secondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const nlzstr = (x: number): string => (x > 9 ? '' : '0') + x;
    return `${hours > 0 ? nlzstr(hours) + ':' : ''}${nlzstr(minutes)}:${nlzstr(seconds)}`;
  }
}

export default YouTubePlayerControllerEntry;