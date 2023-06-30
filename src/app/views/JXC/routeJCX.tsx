import React from "react";
import { Route } from "react-router-dom";
import { gContact, gGoods } from "./Atom";
import { routeAtomCenter } from "./Atom";
import { routeSubjectCenter, routeReportStorage } from "./Subject";
import { routePrice } from "./AssignPrice";
import { routeSheetView } from './SheetView';
import { UqApp, useUqApp } from "app/UqApp";
// import { routeSheetCenter } from "./Sheet";
import { routePermits } from "./Permits";
import { GAtom, GSheet, GSpec } from "app/tool";
import { gPurchase } from "./Sheet/Purchase";
import { gSale } from "./Sheet/Sale";
import { gStoreIn } from "./Sheet/StoreInHook";
import { gStoreInM } from "./Sheet/StoreInMHook";
import { gStoreOut } from "./Sheet/StoreOut";
import { PageSheetCenter } from "./Sheet";
import { gSpecBatchValid, gSpecSheo } from "./Atom/Spec";
import { EntityAtom, EntitySpec } from "app/Biz/EntityAtom";
import { pathAtomList, pathAtomNew } from "app/hooks";

export const pathJXC = 'jxc';
export const pathSheetCenter = 'sheet-center';
export function routeJCX(uqApp: UqApp) {
    // {routeGoods(uqApp)}
    // {routeContact(uqApp)}
    buildSpecs(uqApp);

    const routes = <>
        {routeAtomCenter}
        {routeAtom(uqApp, gContact)}
        {routeAtom(uqApp, gGoods)}

        {routeSheet(uqApp, gPurchase)}
        {routeSheet(uqApp, gSale)}
        {routeSheet(uqApp, gStoreIn)}
        {routeSheet(uqApp, gStoreInM)}
        {routeSheet(uqApp, gStoreOut)}

        <Route path={pathSheetCenter} element={<PageSheetCenter />} />

        {routeSubjectCenter}
        {routeReportStorage}
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

function routeAtom(uqApp: UqApp, gAtom: GAtom) {
    const { name, pageNew, pageList, pageView } = gAtom;
    const entity = uqApp.biz.entities[name] as EntityAtom;
    const ga = {
        ...gAtom,
        entity,
    }
    uqApp.gAtoms[name] = ga;
    uqApp.gAtoms[entity.phrase] = ga;
    return <React.Fragment key={name}>
        <Route path={pathAtomNew(name)} element={pageNew} />
        <Route path={`${pathAtomList(name)}`} element={pageList} />
        <Route path={`${pathAtomList(name)}/:atom`} element={pageList} />
        <Route path={`${name}-view/:id`} element={pageView} />
        <Route path={`${name}/:id`} element={pageView} />
    </React.Fragment>;
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