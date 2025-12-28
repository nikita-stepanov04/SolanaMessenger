export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor((Math.abs(hash) % 360));
  return `hsl(${color}, 70%, 50%)`;
}

export function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}
