import { Route } from "react-router-dom";
import { routeContact } from "./AtomContact";
import { routeProduct } from "./AtomProduct";
import { routePurchase } from "./SheetPurchase";
import { routeSheetCenter } from "./SheetCenter";
import { routeStoreIn } from "./SheetStoreIn";
import { routeSale } from "./SheetSale";
import { routeAtomCenter } from "./AtomCenter";
import { routeStoreOut } from "./SheetStoreOut";
import { routeReportStorage } from "./ReportStorage";
import { routeReportCenter } from "./ReportCenter";
import { routePrice } from "./AssignPrice";
import { UqApp } from "app/UqApp";

export const pathJXC = 'jxc';
export function routeJCX(uqApp: UqApp) {
    const routes = <>
        {routeAtomCenter}
        {routeProduct(uqApp)}
        {routeContact(uqApp)}

        {routeSheetCenter}
        {routePurchase}
        {routeStoreIn}
        {routeSale}
        {routeStoreOut}

        {routeReportCenter}
        {routeReportStorage}

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
