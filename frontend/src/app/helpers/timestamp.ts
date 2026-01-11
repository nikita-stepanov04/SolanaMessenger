export class LinuxMicrosecondTimestamp {
  public static now() {
    return Date.now() * 1000;
  }

  public static parse(timestamp: number) {
    return new Date(Math.ceil(timestamp / 1000));
  }
}
