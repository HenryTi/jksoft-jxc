import { Route } from 'react-router-dom';
import { PageUserAdmin, pathUser } from './PageUserAdmin';

export * from './PageUserAdmin';

export const routeUser = <>
    <Route path={pathUser} element={<PageUserAdmin />} />
</>;
