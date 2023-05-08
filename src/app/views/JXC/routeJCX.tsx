import { Route } from "react-router-dom";
import { routeContact, routeProduct } from "./Atom";
import { routeSheetCenterOld, routePurchase, routeStoreIn, routeSale, routeStoreOut } from "./SheetOld";
import { routeAtomCenter } from "./Atom";
import { routeSubjectCenter, routeReportStorage } from "./Subject";
import { routePrice } from "./AssignPrice";
import { routeSheetView } from './SheetView';
import { UqApp } from "app/UqApp";
import { routeSheet } from "./Sheet";

export const pathJXC = 'jxc';
export function routeJCX(uqApp: UqApp) {
    const routes = <>
        {routeAtomCenter}
        {routeProduct(uqApp)}
        {routeContact(uqApp)}

        {routeSheet(uqApp)}

        {routeSheetCenterOld}
        {routePurchase(uqApp)}
        {routeStoreIn(uqApp)}
        {routeSale(uqApp)}
        {routeStoreOut(uqApp)}

        {routeSubjectCenter}
        {routeReportStorage}
        {routeSheetView(uqApp)}

        {routePrice}
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
