import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './app/interceptors/auth-interceptor';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import {provideStore} from '@ngrx/store';
import {reducers} from './app/state/register-reducers';
import {effects} from './app/state/register-effects';
import {clearStateMetaReducer} from './app/state/root/root.reducer';
import { provideRouterStore } from '@ngrx/router-store';

bootstrapApplication(App, {
  ...appConfig,  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(reducers, { metaReducers: [clearStateMetaReducer] }),
    provideEffects(effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), autoPause: true }),
    provideRouterStore()
]
}).catch(err => console.error(err));
