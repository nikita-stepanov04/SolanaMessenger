import {NameNotation} from '../state/resources/models/resources-models';
import {ChatUsersData} from '../state/chats/chats-models';

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
      if (shortened) {
        const initials = [firstName, patronymic].filter(Boolean).join('.');
        return `${initials}${initials ? '. ' : ''}${lastName}`;
      }
      return [firstName, patronymic, lastName].filter(Boolean).join(' ');

    default:
      return [firstName, lastName].filter(Boolean).join(' ');
  }
}
