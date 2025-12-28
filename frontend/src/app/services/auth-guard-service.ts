import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {NotificationService} from './notification-service';
import {Polices} from '@models/enums/policies';
import {ResourcesService} from '../state/resources/resources-service';
import {RoutePath} from '../app.routes';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../state/auth/auth.selectors';
import {firstValueFrom, of, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private notification: NotificationService,
    private resources: ResourcesService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    _: RouterStateSnapshot): Promise<boolean> {
    const policy = route.data['policy'];

    return firstValueFrom(
      this.store.select(AuthSelectors.isAuthorized(policy)).pipe(
        switchMap(authorized => {
          if (authorized)
            return of(true);

          this.router.navigate([RoutePath.Login]);
          return this.store.select(AuthSelectors.isAuthorized(Polices.AuthorizedAny)).pipe(
            switchMap(authorized => this.resources.get(authorized? 'str029' : 'str028')),
            tap(text => this.notification.error(text)),
            switchMap(() => of(false))
          );
        })
      )
    );
  }
}
