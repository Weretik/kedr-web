import { createAppConfig } from './config/app-config';
import { readEnvironment } from './env/environment-reader';

export const appConfig = createAppConfig(readEnvironment());

export type { AppConfig } from './config/app-config.types';
