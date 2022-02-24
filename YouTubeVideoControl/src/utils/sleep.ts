export default async function sleep(msec: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, msec);
  });
}
