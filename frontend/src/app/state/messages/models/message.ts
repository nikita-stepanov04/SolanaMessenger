export class Message {
  constructor(
    public id: string,
    public userID: string,
    public chatID: string,
    public text: string,
    public timestamp: number,
    public ciphertext: string,
    public nonce: string,
    public tag: string,
    public isPending: boolean,
  ) {}
}
