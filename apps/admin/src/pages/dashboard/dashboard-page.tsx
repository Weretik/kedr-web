import { appConfig } from '../../shared/config/app-config';

const dashboardCards = [
  {
    title: 'Catalog',
    description: 'Product and taxonomy management stays isolated inside the admin domain.',
    enabled: appConfig.features.catalog,
  },
  {
    title: 'Orders',
    description: 'A dedicated workflow surface can be added without coupling it to the storefront.',
    enabled: true,
  },
  {
    title: 'Operations',
    description: 'Shared utilities remain in shared libs, while admin-specific flows stay under admin scope.',
    enabled: true,
  },
] as const;

export function DashboardPage() {
  return (
    <main className="dashboard-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h1>{appConfig.name}</h1>
          <p className="hero-copy">
            React admin is isolated from the Angular storefront and prepared for feature-based growth.
          </p>
        </div>
        <dl className="hero-stats" aria-label="Application configuration">
          <div>
            <dt>Version</dt>
            <dd>{appConfig.version}</dd>
          </div>
          <div>
            <dt>API</dt>
            <dd>{appConfig.apiBaseUrl}</dd>
          </div>
          <div>
            <dt>Logs</dt>
            <dd>{appConfig.enableHttpLogs ? 'Enabled' : 'Disabled'}</dd>
          </div>
        </dl>
      </section>

      <section className="section-block" aria-labelledby="admin-modules-title">
        <div className="section-heading">
          <p className="eyebrow">Modules</p>
          <h2 id="admin-modules-title">Feature-oriented entry points</h2>
        </div>
        <div className="module-grid">
          {dashboardCards.map((card) => (
            <article className="module-card" key={card.title}>
              <div className="module-card__status" data-enabled={card.enabled}>
                {card.enabled ? 'Ready' : 'Disabled'}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
