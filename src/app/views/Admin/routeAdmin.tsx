import { Route } from "react-router-dom";
import { PageProp } from "./prop/PageProp";
import { PagePropEdit } from "./prop/PagePropEdit";
import { PageAdmin, pathAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";
import { UqApp } from "app/UqApp";
import { gSubject } from "./achieve/AtomSubject";
import { routeAtom } from "../routeAtom";
import { gPersonPost } from "./achieve/AtomPersonPost";
import { gGroupPost } from "./achieve/AtomGroupPost";
import { routeUser } from "./user";

export const pathProp = 'prop';
export function routeAdmin(uqApp: UqApp) {
    return <>
        <Route path={pathProp} element={<PageProp />} />
        <Route path={`${pathProp}/:prop`} element={<PagePropEdit />} />
        <Route path={pathAdmin} element={<PageAdmin />} />
        {routeAchieve}
        {routeUser}
        {routeAtom(uqApp, gSubject)}
        {routeAtom(uqApp, gPersonPost)}
        {routeAtom(uqApp, gGroupPost)}
    </>;
}
// export const routeAdminTab = <Route path={pathAdmin + '/*'} element={<TabAdmin />} />;
// export const adminTab = { to: '/' + pathAdmin, caption: '管理员', icon: 'wrench' };
