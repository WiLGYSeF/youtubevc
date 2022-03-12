export default function trimstr(str: string, ...chars: string[]): string {
  let start = 0;
  let end = str.length - 1;

  const set = new Set(chars);
  for (; start < str.length && set.has(str[start]); start += 1);
  for (; end >= 0 && set.has(str[end]); end -= 1);

  return str.slice(start, end + 1);
}
