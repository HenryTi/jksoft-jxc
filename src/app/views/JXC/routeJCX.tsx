import React from "react";
import { Route } from "react-router-dom";
import { UqApp } from "app/UqApp";
import { routePermits } from "./Permits";
import { GSheet, GSpec, GSubject } from "app/tool";
import { gPurchase } from "./Sheet/Purchase";
import { gSale } from "./Sheet/Sale";
import { gStoreIn } from "./Sheet/StoreInHook";
import { gStoreOut } from "./Sheet/StoreOut";
import { gSpecBatchValid, gSpecSheo } from "./Atom/Spec";
import { EntitySpec } from "app/Biz/EntityAtom";
import { pathSubjectHistory } from "app/hooks";
import { routeMy } from "./My";
import { EntitySheet } from "app/Biz";

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
