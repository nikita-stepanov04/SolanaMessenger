import {createReducer, on} from '@ngrx/store';
import {ResourcesActions} from './resources-actions';
import {environment} from '../../../environments/environment';

export interface ResourcesState {
  selectedLangCode: string
}

export const initialResourcesState: ResourcesState = {
  selectedLangCode: environment.appDefaultLang,
}

export const ResourcesReducers = createReducer(
  initialResourcesState,
  on(ResourcesActions.switchLang, ((state, {langCode}) => ({...state, selectedLangCode: langCode})))
)
