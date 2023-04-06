import { Route } from "react-router-dom";
import { routeContact } from "./AtomContact";
import { routeProduct, } from "./AtomProduct";
import { routePurchase } from "./SheetPurchase";
import { routeSheetCenter } from "./SheetCenter";
import { routeStoreIn } from "./SheetStoreIn";
import { routeSale } from "./SheetSale";
import { routeAtomCenter } from "./AtomCenter";
import { routeStoreOut } from "./SheetStoreOut";
import { routeReportStorage } from "./ReportStorage";
import { routeReportCenter } from "./ReportCenter";
import { routePrice } from "./AssignPrice";

export const pathJXC = 'jxc';
const routes = <>
    {routeAtomCenter}
    {routeProduct}
    {routeContact}

    {routeSheetCenter}
    {routePurchase}
    {routeStoreIn}
    {routeSale}
    {routeStoreOut}

    {routeReportCenter}
    {routeReportStorage}

    {routePrice}
</>;
export const routeJCX = <>
    <Route path={`${pathJXC}/*`}>
        {routes}
    </Route>
    <Route path={`/*`}>
        {routes}
    </Route>
</>;
