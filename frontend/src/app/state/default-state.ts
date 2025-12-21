export interface DefaultState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const defaultState = {
  loading: false,
  loaded: false,
  error: null,
}
