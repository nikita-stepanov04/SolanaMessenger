import {inject, Injectable, signal} from '@angular/core';
import {ResourcesService} from '../state/resources/resources-service';

const SUCCESS_AUTOHIDE_TIMEOUT = 1500;
const ERROR_AUTOHIDE_TIMEOUT = 3500;

const ERROR_CODE_MESSAGES: Record<string, string> = {
  '400': 'str032',
  '401': 'str028',
  '500': 'str032'
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public error$ = signal<string>('');
  public success$ = signal<string>('');

  private resource = inject(ResourcesService)

  success(msg: string): void {
    this.update(msg, true);
  }

  public error(err: any): void {
    const message = err?.error?.message;
    const status = err?.status;

    if (message) {
      this.update(message, false);
    }
    else if (status) {
      const statusTextCode = ERROR_CODE_MESSAGES[status];
      if (!statusTextCode){
        this.update(`Error ${status}`, false);
        return;
      }
      this.resource
        .get(statusTextCode)
        .subscribe(text => this.update(text, false));
    }
    else {
      this.update(err, false)
    }
  }

  public clearError() {
    this.update('', false)
  }

  public clearSuccess() {
    this.update('', true);
  }

  private update(msg: string, success: boolean): void {
    const channel = success ? this.success$ : this.error$;
    channel.set(msg);
    if (msg) {
      setTimeout(() => channel.set(''),
        success ? SUCCESS_AUTOHIDE_TIMEOUT : ERROR_AUTOHIDE_TIMEOUT);
    }
  }
}
