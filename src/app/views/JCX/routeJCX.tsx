import { Route } from "react-router-dom";
import { routeContact } from "./IDContact";
import { routeProduct, } from "./IDProduct";
import { routePurchase } from "./SheetPurchase";
import { routeSheetCenter } from "./SheetCenter";
import { routeStoreIn } from "./SheetStoreIn";
import { routeSale } from "./SheetSale";
import { routeIDCenter } from "./IDCenter";
import { routeStoreOut } from "./SheetStoreOut";
import { routeReportStorage } from "./ReportStorage";
import { routeReportCenter } from "./ReportCenter";
import { routePrice } from "./SettingPrice";

export const pathJXC = 'jxc';
const routes = <>
    {routeIDCenter}
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
