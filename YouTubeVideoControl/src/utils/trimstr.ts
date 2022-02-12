export default function trimstr(str: string, chr: string): string {
  let start = 0;
  let end = str.length - 1;

  for (; start < str.length && str[start] === chr; start += 1);
  for (; end >= 0 && str[end] === chr; end -= 1);

  return str.slice(start, end + 1);
}
