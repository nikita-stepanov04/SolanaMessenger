import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {LangTypes} from '@models/resources/langTypes';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesService {
  constructor(private translate: TranslateService) {
    const lang = this.getSelectedLanguage();
    this.translate.addLangs(LangTypes.supportedLangs);
    this.translate.setFallbackLang(lang);
    this.translate.use(lang);
  }

  get(key: string): string {
    return this.translate.instant(key);
  }

  getObs(key: string): Observable<string> {
    return this.translate.get(key);
  }

  async getAsync(key: string): Promise<string>{
    return await firstValueFrom(this.translate.get(key));
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
