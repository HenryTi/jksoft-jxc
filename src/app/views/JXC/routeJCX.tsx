import { Route } from "react-router-dom";
import { UqApp } from "app/UqApp";
import { routeMy } from "./My";

import { routeAtomCenter } from "./Atom";
import { routeSheetCenter } from "./Sheet";

export const pathJXC = 'jxc';
export function routeJCX(uqApp: UqApp) {
    // console.error('routeJCX', pathJXC);
    // buildSpecs(uqApp);

    const routes = <>
        {routeAtomCenter(uqApp)}
        {routeSheetCenter(uqApp)}
        {routeMy}
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
    {routePermits}
    */
    return <>
        <Route path={`${pathJXC}/*`}>
            {routes}
        </Route>
        <Route path={`/*`}>
            {routes}
        </Route>
    </>;
}
