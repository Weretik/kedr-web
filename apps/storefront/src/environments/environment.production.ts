export const environment = {
  production: true,
  enableHttpLogs: false,

  app: {
    name: 'Kedr Store',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://api.Kedr.com.ua/',
    timeoutMs: 15000,
  },

  features: {
    home: true,
    catalog: true,
  },
  logging: {
    enabled: true,
    level: 'debug',
  },
};
