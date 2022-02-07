import { YouTubePlayer } from 'youtube-player/dist/types';
import Coroutine, { MSEC_PER_SEC } from '../../utils/coroutine';
import lerp from '../../utils/lerp';

import YouTubePlayerControllerEntry, { ControlType } from './YouTubePlayerControllerEntry';

export interface SphericalProperties {
  yaw: number;
  pitch: number;
  roll: number;
  fov: number;
}

// the YouTubePlayer type declaration is outdated and does not contain properties for 360 videos
export interface YouTubePlayer360 extends YouTubePlayer {
  getSphericalProperties(): SphericalProperties | {};
  setSphericalProperties(props: SphericalProperties): void;
}

export interface Ytpc360State {
  sphereProps: SphericalProperties;
  lerpSeconds?: number;
}

class Ytpc360Entry extends YouTubePlayerControllerEntry {
  public static ACTION_STR: string = 'set 360° view to';

  public sphereProps: SphericalProperties;
  public lerpSeconds: number;

  constructor(atTime: number, sphereProps: SphericalProperties, lerpSeconds?: number) {
    super(ControlType.ThreeSixty, atTime);

    this.sphereProps = sphereProps;
    this.lerpSeconds = lerpSeconds ?? -1;
  }

  public get actionStr(): string {
    return Ytpc360Entry.ACTION_STR;
  }

  public performAction(ytPlayer: YouTubePlayer360, currentTime: number): void {
    if (this.lerpSeconds > 0) {
      const props = ytPlayer.getSphericalProperties();
      if (Object.keys(props).length) {
        const p = props as SphericalProperties;
        const lerpMs = this.lerpSeconds * MSEC_PER_SEC;

        const routine = new Coroutine((timestamp: number) => {
          const t = (timestamp - routine.startTime) / lerpMs;
          ytPlayer.setSphericalProperties({
            yaw: lerp(p.yaw, this.sphereProps.yaw, t),
            pitch: lerp(p.pitch, this.sphereProps.pitch, t),
            roll: lerp(p.roll, this.sphereProps.roll, t),
            fov: lerp(p.fov, this.sphereProps.fov, t),
          });
        }, lerpMs);
        routine.start();
      }
    } else {
      ytPlayer.setSphericalProperties(this.sphereProps);
    }
  }

  public getState(): Ytpc360State {
    return {
      sphereProps: { ...this.sphereProps },
      lerpSeconds: this.lerpSeconds,
    };
  }

  public getControlStr(): string {
    let result = `yaw ${this.sphereProps.yaw}, pitch ${this.sphereProps.pitch}, roll ${this.sphereProps.roll}, fov ${this.sphereProps.fov}`;

    if (this.lerpSeconds > 0) {
      result += ` during the next ${this.lerpSeconds} seconds`;
    }

    return result;
  }
}

export default Ytpc360Entry;
