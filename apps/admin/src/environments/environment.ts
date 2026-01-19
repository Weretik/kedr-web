export const environment = {
  production: false,
  enableHttpLogs: true,

  app: {
    name: 'Kedr Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'https://localhost:7230/admin',
  },

  features: {
    dashboard: true,
    catalog: true,
  },
};
