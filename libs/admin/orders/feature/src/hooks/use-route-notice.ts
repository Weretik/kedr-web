import { useLocation, useNavigate } from 'react-router-dom';

/** Navigation state that carries a one-time success notice to the next page. */
export const withNotice = (notice: string) => ({ state: { notice } });

/** The notice the previous page passed on, and a way to dismiss it so it does not come back. */
export function useRouteNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { notice?: unknown } | null;
  const notice = typeof state?.notice === 'string' ? state.notice : null;
  const close = () =>
    void navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
  return { notice, close };
}
