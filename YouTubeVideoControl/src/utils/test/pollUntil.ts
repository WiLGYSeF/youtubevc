import sleep from '../sleep';

export default async function pollUntil(
  condition: () => boolean,
  timeout: number,
  tick: number,
): Promise<boolean> {
  let conditionMet = condition();
  for (let total = 0; total < timeout && !conditionMet; total += tick) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(tick);
    conditionMet = condition();
  }
  return conditionMet;
}
