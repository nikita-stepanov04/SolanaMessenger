import {NameNotation} from '../state/resources/models/resources-models';
import {ChatUsersData} from '../state/chats/chats-models';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import {environment} from '../../environments/environment';

export function stringFormat(str: string, ...args: (string | number)[]): string {
  return str.replace(/{(\d+)}/g, (match, index) => {
    const i = Number(index);
    return typeof args[i] !== 'undefined' ? String(args[i]) : match;
  });
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor((Math.abs(hash) % 360));
  return `hsl(${color}, 70%, 50%)`;
}

export function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

export function normalizeName(name: string) {
  name = name.trim();
  if (!name)
    return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function localizeName(user: ChatUsersData, shortened: boolean, nameNotation: NameNotation) {
  const firstName = shortened ? getInitial(user.firstName) : normalizeName(user.firstName);
  const lastName = shortened ? normalizeName(user.secondName) : normalizeName(user.secondName);
  const patronymic = shortened ? getInitial(user.patronymic) : normalizeName(user.patronymic);

  switch (nameNotation) {
    case NameNotation.EASTERN:
      if (shortened) {
        const initials = [firstName, patronymic].filter(Boolean).join('.');
        return `${lastName} ${initials}${initials ? '.' : ''}`;
      }
      return [lastName, firstName, patronymic].filter(Boolean).join(' ');

    case NameNotation.WESTERN:
      const c2l = new CyrillicToTranslit({ preset: environment.appDefaultLang });

      if (shortened) {
        const initials = [firstName, patronymic]
          .filter(Boolean)
          .map(name => c2l.transform(name[0]))
          .join('.');
        return `${initials}${initials ? '. ' : ''}${c2l.transform(lastName)}`;
      }
      return [firstName, patronymic, lastName]
        .filter(Boolean)
        .map(name => c2l.transform(name))
        .join(' ');

    default:
      return [firstName, lastName].filter(Boolean).join(' ');
  }
}

export function formatDate(date: number, countryCode: string) {
  const formatter = new Intl.DateTimeFormat(countryCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formatter.format(new Date(Math.ceil(date / 1000)));
}

export function formatTime(time: number, countryCode: string) {
  const formatter = new Intl.DateTimeFormat(countryCode, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatter.format(new Date(Math.ceil(time / 1000)));
}
