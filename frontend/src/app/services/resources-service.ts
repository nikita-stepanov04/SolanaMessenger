import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {LangTypes} from '@models/resources/langTypes';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private translate: TranslateService) {
    const langs = LangTypes.supportedLangs
    this.translate.addLangs(langs);
    this.translate.setFallbackLang(langs[0]);
    this.translate.use(langs[0]);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  get(key: string): Observable<string> {
    return this.translate.get(key);
  }
}
