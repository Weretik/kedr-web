import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Catalog', to: '/dashboard' },
] as const;

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-block">
          <span className="brand-kicker">Kedr</span>
          <strong>Admin</strong>
        </div>
        <nav aria-label="Admin navigation">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                  end={item.to === '/'}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="admin-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">React Admin</p>
            <h1>Control surface</h1>
          </div>
          <p className="topbar-copy">Separate runtime, separate responsibility, shared workspace.</p>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
