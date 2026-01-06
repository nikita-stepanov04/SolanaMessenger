export class DecryptedMessage {
  constructor(
    public id: string,
    public userID: string,
    public chatID: string,
    public text: string,
    public timestamp: number,
    public isPending: boolean,
  ) {}
}
