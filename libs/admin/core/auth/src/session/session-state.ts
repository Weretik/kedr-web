let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (nextAccessToken: string | null): void => {
  accessToken = nextAccessToken;
};
