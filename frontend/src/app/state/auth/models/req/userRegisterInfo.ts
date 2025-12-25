import {Roles} from '@models/enums/roles';

export class UserRegisterInfo {
  constructor(
    public login: string,
    public password: string,
    public masterPassword: string | null,
    public x25519Pub: string,
    public firstName: string,
    public secondName: string,
    public lastName: string,
    public role: Roles
  ) {}
}
