import { initializeAdminAuth } from '@admin/core/auth';

import { bootstrapAdminApp } from './app/bootstrap';

const authInitialization = initializeAdminAuth();

bootstrapAdminApp(authInitialization);
