export const APP_BASE_DOMAIN = process.env.NEXT_PUBLIC_APP_BASE_DOMAIN || (process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'opnmrt.com');

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/?$/, '/');

export const APP_URL = process.env.NODE_ENV === 'development'
    ? `http://${APP_BASE_DOMAIN}`
    : `https://${APP_BASE_DOMAIN}`;
