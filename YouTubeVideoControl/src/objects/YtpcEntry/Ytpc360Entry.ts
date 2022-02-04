import { YouTubePlayer } from 'youtube-player/dist/types';
import Coroutine, { MSEC_PER_SEC } from '../../utils/coroutine';
import { lerp } from '../../utils/lerp';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

interface SphericalProperties {
  yaw: number;
  pitch: number;
  roll: number;
  fov: number;
}

// the YouTubePlayer type declaration is outdated and does not contain properties for 360 videos
interface YouTubePlayer360 extends YouTubePlayer {
  getSphericalProperties: () => SphericalProperties;
  setSphericalProperties: (props: SphericalProperties) => void;
}

class Ytpc360Entry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'set 360° view to';

  public yaw: number;
  public pitch: number;
  public roll: number;
  public fov: number;

  public lerpSeconds: number;

  constructor(
    atTime: number,
    yaw: number,
    pitch: number,
    roll: number,
    fov: number,
    lerpSeconds?: number,
  ) {
    super(ControlType.Volume, atTime);

    this.yaw = yaw;
    this.pitch = pitch;
    this.roll = roll;
    this.fov = fov;
    this.lerpSeconds = lerpSeconds ?? -1;
  }

  public performAction(ytPlayer: YouTubePlayer360, currentTime: number): void {
    if (this.lerpSeconds > 0) {
      const props = ytPlayer.getSphericalProperties();
      const lerpMs = this.lerpSeconds * MSEC_PER_SEC;

      const routine = new Coroutine((timestamp: number) => {
        const t = (timestamp - routine.startTime) / lerpMs;
        ytPlayer.setSphericalProperties({
          yaw: lerp(props.yaw, this.yaw, t),
          pitch: lerp(props.pitch, this.pitch, t),
          roll: lerp(props.roll, this.roll, t),
          fov: lerp(props.fov, this.fov, t),
        });
      }, lerpMs);
      routine.start();
    } else {
      ytPlayer.setSphericalProperties({
        yaw: this.yaw,
        pitch: this.pitch,
        roll: this.roll,
        fov: this.fov,
      });
    }
  }

  public getActionStr(): string {
    return Ytpc360Entry.ACTION_STR;
  }

  public getControlStr(): string {
    let result = `yaw ${this.yaw}, pitch ${this.pitch}, roll ${this.roll}, fov ${this.fov}`;

    if (this.lerpSeconds > 0) {
      result += ` during the next ${this.lerpSeconds} seconds`;
    }

    return result;
  }
}

export default Ytpc360Entry;
