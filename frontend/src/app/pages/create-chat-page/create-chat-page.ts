import {Component, ElementRef, signal, ViewChild} from '@angular/core';
import {FormTemplate} from '../../templates/form-template/form-template';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {TextInput} from '../../components/inputs/text-input/text-input';
import {ChatsService} from '../../state/chats/chats-service';
import {BehaviorSubject, combineLatest, finalize, Observable, of, OperatorFunction, take} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from '@ng-bootstrap/ng-bootstrap';
import {CloseButton} from '../../components/buttons/close-button/close-button';
import {NotificationService} from '../../services/notification-service';
import {ResourcesService} from '../../state/resources/resources-service';
import {UserInfo} from '../../state/auth/models/resp/userInfo';
import {Store} from '@ngrx/store';
import {ResourcesSelectors} from '../../state/resources/resources-selectors';
import {Spinner} from '../../components/spinner/spinner';
import {DefaultButton} from '../../components/buttons/default-button/default-button';
import {RedirectLink} from '../../components/links/router-link/router-link';
import {RoutePath} from '../../app.routes';
import {FormHelperService} from '../../services/form-helper-service';
import {stringFormat} from '../../helpers/format';

const MIN_CHAT_USERS_COUNT = 2;
const MAX_CHAT_USERS_COUNT = 10;

@Component({
  selector: 'app-create-chat-page',
  imports: [
    FormTemplate,
    ReactiveFormsModule,
    TranslatePipe,
    TextInput,
    FormsModule,
    NgbTypeahead,
    CloseButton,
    Spinner,
    DefaultButton,
    RedirectLink,
  ],
  templateUrl: './create-chat-page.html',
  styles: ``,
})
export class CreateChatPage {
  @ViewChild('userSearchInput') userSearchInput: ElementRef;

  protected createChatForm: FormGroup;
  protected searchUserComponent: FormControl;

  protected loadingUsers$ = signal(false);
  protected selectedUsers$ = signal<UserInfo[]>([]);

  private creatingChatSubject = new BehaviorSubject<boolean>(false);
  protected creatingChat$ = this.creatingChatSubject.asObservable();

  userSearchResultFormat = (user: UserInfo) => user.formatedName;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private chats: ChatsService,
    private resources: ResourcesService,
    private notification: NotificationService,
    protected fh: FormHelperService,
  ) {
    this.createChatForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      userSearch: ['']
    });
    this.searchUserComponent = this.createChatForm.get('userSearch') as FormControl;
  }

  protected onSubmit(): void {
    this.searchUserComponent.markAsTouched();

    if (this.selectedUsers$().length < MIN_CHAT_USERS_COUNT) {
      this.searchUserComponent.setErrors({ notEnoughUsers: true });
      return;
    }

    const fv = this.createChatForm.value;
    const chat = {
      name: fv.name,
      chatUsersIDs: this.selectedUsers$().map((user) => user.id)
    }
    this.creatingChatSubject.next(true);
    this.chats.createChat(chat)
      .pipe(
        finalize(() => this.creatingChatSubject.next(false))
      )
      .subscribe({
        next: () => this.resources.get('str052')
          .pipe(take(1))
          .subscribe(str => {
            this.notification.success(stringFormat(str, chat.name))
            this.createChatForm.reset();
            this.selectedUsers$.set([])
          }),
        error: err => this.notification.error(err)
      })
  }

  clearUserSearchError() {
    this.searchUserComponent.setErrors(null);
  }

  onUserSelected(event: NgbTypeaheadSelectItemEvent<UserInfo>) {
    const user = event.item;
    setTimeout(() => this.userSearchInput.nativeElement.value = '');

    if (this.selectedUsers$().filter(u => u.id === user.id).length > 0) {
      this.resources.get('str047')
        .pipe(take(1))
        .subscribe(str => this.notification.success(str));
      return;
    }
    this.selectedUsers$.update(users => [...users, event.item]);

    if (this.selectedUsers$().length >= MAX_CHAT_USERS_COUNT)
      this.toggleSearchUserInputDisability(true);
  }

  onUserRemove(userID: string) {
    this.selectedUsers$.update(users => [...users.filter(u => u.id !== userID)]);
    if (this.selectedUsers$().length < MAX_CHAT_USERS_COUNT)
      this.toggleSearchUserInputDisability(false);
  }

  search: OperatorFunction<string, readonly UserInfo[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => term.trim()),
      tap(() => this.loadingUsers$.set(true)),
      switchMap((term) => {
        if (!term) {
          this.loadingUsers$.set(false)
          return of([]);
        }
        return this.chats.searchForUsers(term).pipe(
          tap(() => this.loadingUsers$.set(false)),
          switchMap(users => combineLatest(
            users.map(u =>
              this.store.select(ResourcesSelectors.formatPersonName(u, false)).pipe(
                map(formatedName => ({ ...u, formatedName }))
            )))
          ),
          catchError(() => {
            this.resources.get('str046')
              .pipe(take(1))
              .subscribe(str => this.notification.error(str));
            this.loadingUsers$.set(false);
            return of([]);
          })
        );
      }),
    );

  private toggleSearchUserInputDisability(disabled: boolean) {
    if (disabled) {
      this.searchUserComponent.disable();
      this.resources.get('str049')
        .pipe(take(1))
        .subscribe(str => this.userSearchInput.nativeElement.placeholder = str);
    } else {
      this.searchUserComponent.enable();
      this.resources.get('str044')
        .pipe(take(1))
        .subscribe(str => this.userSearchInput.nativeElement.placeholder = str);
    }
  }

  protected readonly RoutePath = RoutePath;
  protected readonly of = of;
}



