import Decimal from 'decimal.js-light';

export interface TimeParts {
  seconds: number;
  minutes?: number;
  hours?: number;
  days?: number;
}

export default function secondsToTimeParts(seconds: number): TimeParts {
  let sec = new Decimal(seconds);
  const days = Math.floor(sec.div(24 * 60 * 60).toNumber());
  sec = sec.mod(24 * 60 * 60);
  const hours = Math.floor(sec.div(60 * 60).toNumber());
  sec = sec.mod(60 * 60);
  const minutes = Math.floor(sec.div(60).toNumber());
  sec = sec.mod(60);

  return {
    seconds: sec.toNumber(),
    minutes,
    hours,
    days,
  };
}
