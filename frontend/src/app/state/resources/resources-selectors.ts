import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ResourcesState} from './resources-reducers';
import {ResourcesAvailable} from './models/resources-available';

const selectResourceState = createFeatureSelector<ResourcesState>('resources');

export const ResourcesSelectors = {
  langCodes: createSelector(() => ResourcesAvailable.map(r => r.langCode)),
  countryCodes: createSelector(() => ResourcesAvailable.map(r => r.countryCode)),
  selectedLangCode: createSelector(selectResourceState, state => state.selectedLangCode),
  selectedCountryCode: createSelector(selectResourceState, state =>
    ResourcesAvailable.filter(r => r.langCode == state.selectedLangCode)[0].countryCode),

  formatDate: (date: number) => createSelector(
    ResourcesSelectors.selectedCountryCode,
    countryCode => {
      if (!countryCode) return '';
      const formatter = new Intl.DateTimeFormat(countryCode, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      return formatter.format(new Date(date));
    }
  )

}
