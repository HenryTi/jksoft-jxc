import { routeProp } from "../../../../prop";
import { routePageAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";
import { UqApp } from "app/UqApp";
import { gSubject } from "./achieve/AtomSubject";
import { routeAtom } from "../routeAtom";
import { gPersonPost } from "./achieve/AtomPersonPost";
import { gGroupPost } from "./achieve/AtomGroupPost";
import { routeUser } from "./user";
import { PageUomIListOfUom, gUom, gUomI, pathUomIListOfUom } from "./uom";
import { Route } from "react-router-dom";
import { PageUomRoot, pathUom } from "./uom/ViewUomList";
import { routeCompile } from "./compile";

export function routeAdmin(uqApp: UqApp) {
    return <>
        {routeProp}
        {routePageAdmin}
        {routeAchieve}
        {routeCompile}
        {routeUser}
        <Route path={pathUom} element={<PageUomRoot />} />
        <Route path={pathUomIListOfUom(':id')} element={<PageUomIListOfUom />} />
    </>;
    { routeAtom(uqApp, gPersonPost) }
    { routeAtom(uqApp, gGroupPost) }
    { routeAtom(uqApp, gUom) }
    { routeAtom(uqApp, gUomI) }
    { routeAtom(uqApp, gSubject) }
}
