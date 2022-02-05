export function trimstr(str: string, chr: string): string {
  let start = 0;
  let end = str.length - 1;

  for (; start < str.length && str[start] == chr; start++);
  for (; end >= 0 && str[end] == chr; end--);

  return str.slice(start, end + 1);
}