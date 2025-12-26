import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Title } from '@angular/platform-browser';
import { routerNavigationAction } from '@ngrx/router-store';
import { of, switchMap, tap } from 'rxjs';
import { ResourcesService } from '../../services/resources-service';
import { ResourcesActions } from './resources-actions';
import {Router} from '@angular/router';

@Injectable()
export class ResourcesEffects {
  private title = inject(Title);
  private router = inject(Router);
  private actions$ = inject(Actions);
  private resources = inject(ResourcesService);

  setTitleOnNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      switchMap(action => {
        const routeConfig = action.payload.routerState.root.firstChild?.routeConfig;
        const titleResource = routeConfig?.title as string;
        return this.resources
          ? this.resources.getObs(titleResource)
          : of(routeConfig?.path ?? '');
      }),
      tap(title => this.title.setTitle(title))
    ), { dispatch: false }
  );

  updateTitle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResourcesActions.changeLanguage),
      switchMap(() => {
        const routeConfig = this.router.routerState.snapshot.root.firstChild?.routeConfig;
        const titleResource = routeConfig?.title as string;
        console.log(routeConfig)
        return this.resources
          ? this.resources.getObs(titleResource)
          : of(routeConfig?.path ?? '');
      }),
      tap(title => this.title.setTitle(title))
    ), { dispatch: false }
  );
}
