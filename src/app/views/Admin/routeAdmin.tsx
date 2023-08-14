import { routeProp } from "./prop";
import { routePageAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";
import { UqApp } from "app/UqApp";
import { gSubject } from "./achieve/AtomSubject";
import { routeAtom } from "../routeAtom";
import { gPersonPost } from "./achieve/AtomPersonPost";
import { gGroupPost } from "./achieve/AtomGroupPost";
import { routeUser } from "./user";
import { gUom, gUomI } from "./uom";

export function routeAdmin(uqApp: UqApp) {
    return <>
        {routeProp}
        {routePageAdmin}
        {routeAchieve}
        {routeUser}
        {routeAtom(uqApp, gSubject)}
        {routeAtom(uqApp, gPersonPost)}
        {routeAtom(uqApp, gGroupPost)}
        {routeAtom(uqApp, gUom)}
        {routeAtom(uqApp, gUomI)}
    </>;
}

// {routeUomList}

// export const routeAdminTab = <Route path={pathAdmin + '/*'} element={<TabAdmin />} />;
// export const adminTab = { to: '/' + pathAdmin, caption: '管理员', icon: 'wrench' };
