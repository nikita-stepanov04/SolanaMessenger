declare module 'cyrillic-to-translit-js' {
  export default class CyrillicToTranslit {
    constructor(options?: { preset?: string });
    transform(input: string): string;
  }
}
