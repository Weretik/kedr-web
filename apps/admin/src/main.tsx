import { initializeAdminAuth } from '@admin/core/auth';

import { bootstrapAdminApp } from './app/bootstrap';

void initializeAdminAuth().finally(bootstrapAdminApp);
