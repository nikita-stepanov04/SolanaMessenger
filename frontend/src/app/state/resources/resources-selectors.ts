import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ResourcesState} from './resources-reducers';
import {ResourcesAvailable} from './models/resources-available';
import {ChatUsersData} from '../chats/chats-models';
import {formatTime, formatDate, localizeName} from '../../helpers/format';
import {UserInfo} from '../auth/models/resp/userInfo';

const selectResourceState = createFeatureSelector<ResourcesState>('resources');

export const ResourcesSelectors = {
  langCodes: createSelector(() => ResourcesAvailable.map(r => r.langCode)),
  countryCodes: createSelector(() => ResourcesAvailable.map(r => r.countryCode)),
  selectedLangCode: createSelector(selectResourceState, state => state.selectedLangCode),

  selectedCountryCode: createSelector(selectResourceState, state =>
    ResourcesAvailable.filter(r => r.langCode == state.selectedLangCode)[0].countryCode),

  selectNameNotation: createSelector(selectResourceState, state =>
    ResourcesAvailable.filter(r => r.langCode == state.selectedLangCode)[0].nameNotation),

  formatDate: (date: number) => createSelector(
    ResourcesSelectors.selectedCountryCode,
    countryCode => formatDate(date, countryCode),
  ),

  formatTime: (date: number) => createSelector(
    ResourcesSelectors.selectedCountryCode,
    countryCode => formatTime(date, countryCode),
  ),

  formatPersonName: (user: ChatUsersData | UserInfo, shortened: boolean) => createSelector(
    ResourcesSelectors.selectNameNotation,
    nameNotation => localizeName(user, shortened, nameNotation)
  )
}
