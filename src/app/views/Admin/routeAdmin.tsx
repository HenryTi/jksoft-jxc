import { routePageAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";
import { UqApp } from "app/UqApp";
import { routeUser } from "./user";
import { PageUomIListOfUom, pathUomIListOfUom } from "./uom";
import { Route } from "react-router-dom";
import { PageUomRoot, pathUom } from "./uom/ViewUomList";
import { routeCompile } from "./compile";

export function routeAdmin(uqApp: UqApp) {
    return <>
        {routePageAdmin}
        {routeAchieve}
        {routeCompile}
        {routeUser}
        <Route path={pathUom} element={<PageUomRoot />} />
        <Route path={pathUomIListOfUom(':id')} element={<PageUomIListOfUom />} />
    </>;
}
