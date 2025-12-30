export class Message {
  constructor(
    public id: string,
    public userID: string,
    public chatID: string,
    public timestamp: number,
    public text: string,
    public salt: string,
    public tag: string
  ) {}
}
