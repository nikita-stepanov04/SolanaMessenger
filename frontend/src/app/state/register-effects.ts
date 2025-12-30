import {ChatsEffects} from './chats/chats-effects';
import {AuthEffects} from './auth/auth.effects';
import {ResourcesEffects} from './resources/resources-effects';
import {MessagesEffects} from './messages/messages-effects';

export const effects = [
  ChatsEffects,
  AuthEffects,
  ResourcesEffects,
  MessagesEffects
]
