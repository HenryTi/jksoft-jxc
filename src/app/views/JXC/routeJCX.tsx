import { Route } from "react-router-dom";
import { routeContact, routeGoods } from "./Atom";
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
        {routeGoods(uqApp)}
        {routeContact(uqApp)}

        {routeSheet(uqApp)}

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
