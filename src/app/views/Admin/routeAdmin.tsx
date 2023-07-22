import { Route } from "react-router-dom";
import { PageProp } from "./prop/PageProp";
import { PagePropEdit } from "./prop/PagePropEdit";
import { PageAdmin, pathAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";

export const pathProp = 'prop';
export const routeAdmin = <>
    <Route path={pathProp} element={<PageProp />} />
    <Route path={`${pathProp}/:prop`} element={<PagePropEdit />} />
    <Route path={pathAdmin} element={<PageAdmin />} />
    {routeAchieve}
</>;
// export const routeAdminTab = <Route path={pathAdmin + '/*'} element={<TabAdmin />} />;
// export const adminTab = { to: '/' + pathAdmin, caption: '管理员', icon: 'wrench' };
