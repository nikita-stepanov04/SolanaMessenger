export class WriteMessage {
  constructor(
    public chatID: string,
    public ciphertext: string,
    public nonce: string,
    public tag: string,
  ) {}
}
