import { Injectable } from '@angular/core';
import {InterpolatableTranslationObject, TranslateService} from '@ngx-translate/core';
import {firstValueFrom, Observable, take} from 'rxjs';
import {Store} from '@ngrx/store';
import {ResourcesAvailable} from './models/resources-available';
import {ResourcesSelectors} from './resources-selectors';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private translate: TranslateService, store: Store) {
    store.select(ResourcesSelectors.selectedLangCode)
      .pipe(take(1))
      .subscribe(langCode => {
        this.translate.addLangs(ResourcesAvailable.map(r => r.langCode));
        this.translate.use(langCode);
        this.translate.setFallbackLang(langCode);
      })
  }

  get(key: string): Observable<string> {
    return this.translate.get(key);
  }

  async getAsync(key: string): Promise<string>{
    return await firstValueFrom(this.translate.get(key));
  }

  setLanguage(langCode: string): Observable<InterpolatableTranslationObject> {
    return this.translate.use(langCode)
  }
}
