export const environment = {
  production: false,
  enableHttpLogs: true,

  app: {
    name: 'Kedr Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'http://localhost:5000/admin',
  },

  features: {
    home: true,
    catalog: true,
  },
};
