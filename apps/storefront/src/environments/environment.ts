export const environment = {
  production: false,
  enableHttpLogs: true,
  publicSiteUrl: 'http://localhost:4200',

  app: {
    name: 'Kedr Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://localhost:7230',
  },

  features: {
    home: true,
    catalog: true,
  },
  logging: {
    enabled: false,
    endpoint: null,
    sampleRate: 1,
  },
};
