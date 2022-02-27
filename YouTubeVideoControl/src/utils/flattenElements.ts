export default function flatten(element: HTMLElement) {
  const result: HTMLElement[] = [];
  const f = (cur: HTMLElement): void => {
    result.push(cur);
    Array.prototype.forEach.call(cur.children, f);
  };
  f(element);
  return result;
}
