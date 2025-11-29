import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {LangTypes} from '@models/resources/langTypes';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private translate: TranslateService) {
    const lang = this.getSelectedLanguage();
    this.translate.addLangs(LangTypes.supportedLangs);
    this.translate.setFallbackLang(lang);
    this.translate.use(lang);
  }

  switchLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  getLanguages(): string[] {
    return LangTypes.supportedLangs;
  }

  getSelectedLanguage(): string {
    return localStorage.getItem('lang') ?? LangTypes.supportedLangs[0];
  }
}
