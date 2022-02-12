import { YouTubePlayer } from 'youtube-player/dist/types';

import Coroutine, { MSEC_PER_SEC } from 'utils/coroutine';
import lerp from 'utils/lerp';
import { mget } from 'utils/regexp-match-group';
import timestampToSeconds from 'utils/timestampToSeconds';
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
  public static YAW_MIN = 0;
  public static YAW_MAX = 360;
  public static YAW_DEFAULT = 0;

  public static PITCH_MIN = -90;
  public static PITCH_MAX = 90;
  public static PITCH_DEFAULT = 0;

  public static ROLL_MIN = -180;
  public static ROLL_MAX = 180;
  public static ROLL_DEFAULT = 0;

  public static FOV_MIN = 30;
  public static FOV_MAX = 120;
  public static FOV_DEFAULT = 100;

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

  public static fromString(str: string): Ytpc360Entry | null {
    const rsNum = String.raw`-?\d+(?:\.\d*)?`;
    const regex = new RegExp([
      String.raw`^At (?<timestamp>${YouTubePlayerControllerEntry.REGEXSTR_TIMESTAMP}),`,
      String.raw` ${Ytpc360Entry.ACTION_STR}`,
      String.raw` yaw (?<yaw>${rsNum})`,
      String.raw`, pitch (?<pitch>${rsNum})`,
      String.raw`, roll (?<roll>${rsNum})`,
      String.raw`, fov (?<fov>${rsNum})`,
      String.raw`(?: during the next (?<lerp>${rsNum}) seconds)?`,
      String.raw`$`,
    ].join(''));

    const match = str.match(regex);
    if (!match) {
      return null;
    }

    try {
      return new Ytpc360Entry(
        timestampToSeconds(mget(match, 'timestamp')),
        {
          yaw: Number(mget(match, 'yaw')),
          pitch: Number(mget(match, 'pitch')),
          roll: Number(mget(match, 'roll')),
          fov: Number(mget(match, 'fov')),
        },
        Number(match.groups ? match.groups.lerp ?? -1 : -1),
      );
    } catch {
      return null;
    }
  }
}

export default Ytpc360Entry;
