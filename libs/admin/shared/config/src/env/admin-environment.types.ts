export interface AdminEnvironment {
  readonly DEV: boolean;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_ENABLE_HTTP_LOGS?: string;
  readonly VITE_FEATURE_CATALOG?: string;
  readonly VITE_FEATURE_DASHBOARD?: string;
  readonly VITE_ROUTER_BASENAME?: string;
}
