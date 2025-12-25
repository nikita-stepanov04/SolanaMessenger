export class UserInfo {
  constructor(
    public id: string,
    public login: string,
    public x25519Pub: string,
    public firstName: string,
    public secondName: string,
    public lastName: string,
    public role: string
  ) {}
}
