export class Resource {
  constructor(
    public langCode: string,
    public countryCode: string,
    public nameNotation: NameNotation) {}
}

export enum NameNotation {
  EASTERN,
  WESTERN
}
