import {ResourcesAvailable} from './models/resources-available';
import {createReducer, on} from '@ngrx/store';
import {ResourcesActions} from './resources-actions';

export interface ResourcesState {
  selectedLangCode: string
}

export const initialResourcesState: ResourcesState = {
  selectedLangCode: ResourcesAvailable[0].langCode,
}

export const ResourcesReducers = createReducer(
  initialResourcesState,
  on(ResourcesActions.switchLang, ((state, {langCode}) => ({...state, selectedLangCode: langCode})))
)
