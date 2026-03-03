export const APP_BASE_DOMAIN = process.env.NEXT_PUBLIC_APP_BASE_DOMAIN || 'opnmrt.com';
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api').replace(/\/?$/, '/');
export const APP_URL = `https://${APP_BASE_DOMAIN}`;
