export class EncryptedMessage {
  constructor(
    public id: string,
    public userID: string,
    public chatID: string,
    public timestamp: number,
    public ciphertext: string,
    public nonce: string,
    public tag: string,
  ) {}
}
