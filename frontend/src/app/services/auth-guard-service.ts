import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth-service';
import {NotificationService} from './notification-service';
import {Polices} from '@models/enums/policies';
import {ResourcesService} from './resources-service';
import {RoutePath} from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService,
    private resources: ResourcesService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot): Promise<boolean> {

    const policy = route.data['policy'];

    if (this.auth.isAuthorized(policy)) {
      return true;
    } else {
      this.router
        .navigate([RoutePath.Login])
        .then(async () => {
          this.notification.error(
            await this.resources.getAsync(this.auth.isAuthorized(Polices.AuthorizedAny)
              ? 'str029' : 'str028'));
        });
      return false;
    }
  }
}
