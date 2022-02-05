export interface TimeParts {
  seconds: number;
  minutes?: number;
  hours?: number;
  days?: number;
}

export default function secondsToTimeParts(seconds: number): TimeParts {
  let sec = seconds;
  const days = Math.floor(sec / (24 * 60 * 60));
  sec %= 24 * 60 * 60;
  const hours = Math.floor(sec / (60 * 60));
  sec %= 60 * 60;
  const minutes = Math.floor(sec / 60);
  sec %= 60;

  return {
    seconds: sec,
    minutes,
    hours,
    days,
  };
}
