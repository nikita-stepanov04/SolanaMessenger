import {createAction, props} from '@ngrx/store';

export const ResourcesActions = {
  switchLang: createAction('[Resource] Switch Language', props<{ langCode: string}>()),
  switchSuccess: createAction('[Resource] Switch Language Success'),
}
