import { Route } from 'react-router-dom';
import { PageUserSum } from './PageUserAdmin';
import { centers } from 'app/views/center';

export * from './PageUserAdmin';

export const routeUserSum = <>
    <Route path={centers.userSum.path} element={<PageUserSum />} />
</>;
