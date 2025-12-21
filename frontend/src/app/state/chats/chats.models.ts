export class Chat {
  constructor(
    public id: string,
    public name: string,
    public timestamp: number,
    public encryptionPayload: UserPayload,
    public usersData: ChatUsersData[]
  ) {}
}

export class UserPayload {
  constructor(
    public ephemeralPublicKey: string,
    public nonce: string,
    public encryptedMessageEncryptionKey: string
  ) {}
}

export class ChatUsersData {
  constructor(
    public id: string,
    public firstName: string,
    public secondName: string,
    public lastName: string
  ) {}
}
