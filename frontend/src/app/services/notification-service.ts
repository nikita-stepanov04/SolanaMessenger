import {Injectable, signal} from '@angular/core';

const SUCCESS_AUTOHIDE_TIMEOUT = 1500;
const ERROR_AUTOHIDE_TIMEOUT = 3500;

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public error$ = signal<string>('');
  public success$ = signal<string>('');

  success(msg: string): void {
    this.update(msg, true);
  }

  public error(err: any): void {
    const message = err?.error?.message;
    const status = err?.status;
    if (message) {
      this.update(message, false);
    } else if (status) {
      this.update(`Error ${status}`, false);
    } else {
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
