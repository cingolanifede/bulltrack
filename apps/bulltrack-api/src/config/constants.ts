export const COOKIE_MAX_AGE_DAYS = 1;
export const REFRESH_COOKIE_MAX_AGE_DAYS = 7;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const AUTH_COOKIE_NAME = 'bulltrack_token';
export const REFRESH_AUTH_COOKIE_NAME = 'bulltrack_refresh_token';
