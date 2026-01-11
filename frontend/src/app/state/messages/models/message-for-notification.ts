export class MessageForNotification {
  constructor(
    public id: string,
    public senderName: string,
    public chatID: string,
    public chatName: string,
    public text: string,
    public timestamp: number,
  ) {}
}
