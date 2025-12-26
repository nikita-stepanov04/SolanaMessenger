export function stringFormat(str: string, ...args: (string | number)[]): string {
  return str.replace(/{(\d+)}/g, (match, index) => {
    const i = Number(index);
    return typeof args[i] !== 'undefined' ? String(args[i]) : match;
  });
}
