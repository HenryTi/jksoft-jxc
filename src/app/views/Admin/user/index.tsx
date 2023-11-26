import { Route } from 'react-router-dom';
import { PageUserAdmin } from './PageUserAdmin';
import { centers } from 'app/views/center';

export * from './PageUserAdmin';

export const routeUser = <>
    <Route path={centers.user.path} element={<PageUserAdmin />} />
</>;
