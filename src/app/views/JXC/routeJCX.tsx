import { Route } from "react-router-dom";
import { UqApp } from "app/UqApp";
import { routeMy } from "./My";

import { routeAtomCenter } from "./Atom";
import { routeSheetCenter } from "./Sheet";
import { routeReportCenter } from "./Report";
import { routePermits } from "./Permits";

export const pathHome = 'home';
export function routeJCX(uqApp: UqApp) {
    // console.error('routeJCX', pathJXC);
    // buildSpecs(uqApp);

    const routes = <>
        {routeAtomCenter()}
        {routeSheetCenter()}
        {routeReportCenter()}
        {routeMy}
        {routePermits}
    </>;
    /*
    { routeAtom(uqApp, gContact) }
    { routeAtom(uqApp, gPerson) }
    { routeAtom(uqApp, gSumGroup) }
    { routeAtom(uqApp, gGoods) }

    {routeSheet(uqApp, gPurchase)}
    {routeSheet(uqApp, gSale)}
    {routeSheet(uqApp, gStoreIn)}
    {routeSheet(uqApp, gStoreInSplit)}
    {routeSheet(uqApp, gStoreOut)}
    {routeSubjectCenter}
    {routeSubject(uqApp, gSubjectStorage)}
    {routeSheetView(uqApp)}

    {routePrice}
    */
    return <>
        <Route path={`${pathHome}/*`}>
            {routes}
        </Route>
        <Route path={`/*`}>
            {routes}
        </Route>
    </>;
}
