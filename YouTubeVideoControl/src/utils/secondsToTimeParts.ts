export interface TimeParts {
  seconds: number;
  minutes?: number;
  hours?: number;
}

export default function secondsToTimeParts(seconds: number): TimeParts {
  let sec = seconds;
  const hours = Math.floor(sec / 3600);
  sec %= 3600;
  const minutes = Math.floor(sec / 60);
  sec %= 60;

  return {
    seconds: sec,
    minutes,
    hours,
  };
}
