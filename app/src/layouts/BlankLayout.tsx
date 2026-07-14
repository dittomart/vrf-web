import { Outlet } from 'react-router-dom';

/* No chrome, no location gate — splash, location, login, not-serviceable. */
export function BlankLayout() {
  return <Outlet />;
}
