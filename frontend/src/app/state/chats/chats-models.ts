export class Chat {
  constructor(
    public id: string,
    public name: string,
    public timestamp: number,
    public encryptionPayload: UserPayload | undefined,
    public usersData: ChatUsersData[] | undefined,
    public hasNewEvents: boolean,
    public lastEventTimestamp: number,
    public areAllMessagesFetched: boolean,
    public scrollOffset: number,
    public cek: string
  ) {}
}

export class CreateChat {
  constructor(
    public name: string,
    public chatUsersIDs: string[],
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
    public patronymic: string
  ) {}
}
