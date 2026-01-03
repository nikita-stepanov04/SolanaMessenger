import {chatsReducers} from './chats/chats-reducers';
import {authReducers} from './auth/auth-reducers';
import {rootReducer} from './root/root-reducer';
import {localStorageSyncReducer} from './local-storage-reducer';
import {ResourcesReducers} from './resources/resources-reducers';
import {messagesReducer} from './messages/messages-reducers';

export const reducers = {
  chats: chatsReducers,
  auth: authReducers,
  resources: ResourcesReducers,
  messages: messagesReducer
};

export const metaReducers = [
  rootReducer.clearStateMetaReducer,
  localStorageSyncReducer,
]

export const persistentReducers = [
  'auth',
  'resources'
]
