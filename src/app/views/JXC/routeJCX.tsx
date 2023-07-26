import React from "react";
import { Route } from "react-router-dom";
import { gContact, gGoods, gPerson, gSumGroup } from "./Atom";
import { routeAtomCenter } from "./Atom";
import { gSubjectStorage, routeSubjectCenter } from "./Subject";
import { routePrice } from "./AssignPrice";
import { routeSheetView } from './SheetView';
import { UqApp } from "app/UqApp";
// import { routeSheetCenter } from "./Sheet";
import { routePermits } from "./Permits";
import { GAtom, GSheet, GSpec, GSubject } from "app/tool";
import { gPurchase } from "./Sheet/Purchase";
import { gSale } from "./Sheet/Sale";
import { gStoreIn } from "./Sheet/StoreInHook";
import { gStoreInSplit } from "./Sheet/StoreInSplitHook";
import { gStoreOut } from "./Sheet/StoreOut";
import { PageSheetCenter } from "./Sheet";
import { gSpecBatchValid, gSpecSheo } from "./Atom/Spec";
import { EntityAtom, EntitySpec } from "app/Biz/EntityAtom";
import { pathAtomList, pathAtomNew, pathSubjectHistory } from "app/hooks";
import { routeAtom } from "../routeAtom";

export const pathJXC = 'jxc';
export const pathSheetCenter = 'sheet-center';
export function routeJCX(uqApp: UqApp) {
    buildSpecs(uqApp);

    const routes = <>
        {routeAtomCenter}
        {routeAtom(uqApp, gContact)}
        {routeAtom(uqApp, gPerson)}
        {routeAtom(uqApp, gSumGroup)}
        {routeAtom(uqApp, gGoods)}

        {routeSheet(uqApp, gPurchase)}
        {routeSheet(uqApp, gSale)}
        {routeSheet(uqApp, gStoreIn)}
        {routeSheet(uqApp, gStoreInSplit)}
        {routeSheet(uqApp, gStoreOut)}

        <Route path={pathSheetCenter} element={<PageSheetCenter />} />

        {routeSubjectCenter}
        {routeSubject(uqApp, gSubjectStorage)}
        {routeSheetView(uqApp)}

        {routePrice}
        {routePermits}
    </>;
    return <>
        <Route path={`${pathJXC}/*`}>
            {routes}
        </Route>
        <Route path={`/*`}>
            {routes}
        </Route>
    </>;
}

const arrSpecs: GSpec[] = [
    gSpecBatchValid,
    gSpecSheo,
];

function buildSpecs(uqApp: UqApp) {
    const { biz: { entities } } = uqApp;
    for (let gSpec of arrSpecs) {
        const { name, caption } = gSpec;
        const entity = entities[name] as EntitySpec;
        const gs = {
            ...gSpec,
            entity,
            caption: caption ?? entity.caption,
        }
        uqApp.gSpecs[name] = gs;
        uqApp.gSpecs[entity.phrase] = gs;
    }
}

function routeSheet(uqApp: UqApp, gSheet: GSheet) {
    const { sheet: name, pageEdit } = gSheet;
    uqApp.gSheets[name] = gSheet;
    uqApp.gSheets['sheet.' + name] = gSheet;
    return <React.Fragment key={name}>
        <Route path={`${name}/:id`} element={pageEdit} />
        <Route path={name} element={pageEdit} />
    </React.Fragment>;
}

function routeSubject(uqApp: UqApp, gSubject: GSubject) {
    const { name, Report, History } = gSubject;
    return <React.Fragment key={name}>
        <Route path={name} element={Report} />
        <Route path={`${pathSubjectHistory(name)}/:id`} element={History} />
    </React.Fragment>;
}
