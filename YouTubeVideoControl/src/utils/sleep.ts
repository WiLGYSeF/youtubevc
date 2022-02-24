export default async function sleep(msec: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, msec));
}
