import {Polices} from '@models/enums/policies';
import {Roles} from '@models/enums/roles';

export const POLICY_ALLOWED_ROLES = [
  {
    Policy: Polices.AuthorizedAny,
    Roles: [
      Roles.User,
      Roles.Admin
    ]
  },
  {
    Policy: Polices.AuthorizedAdmins,
    Roles: [
      Roles.Admin
    ]
  }
]
