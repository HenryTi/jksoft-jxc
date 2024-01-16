import { Route } from "react-router-dom";
import { routeMy } from "./My";

import { routeAtomCenter } from "./Atom";
import { routeSheetCenter } from "./Sheet";
import { routeReportCenter } from "./Report";
import { routePermits } from "./Permits";
import { routeAssignCenter } from "./Assign";
import { routeTieCenter } from "./Tie";
import { routeEditingCenter } from "./Editing";
import { routeIOCenter } from "./IO";

export const pathHome = 'home';
export function routeApp() {
    const routes = <>
        {routeEditingCenter()}
        {routeAtomCenter()}
        {routeSheetCenter()}
        {routeReportCenter()}
        {routeAssignCenter()}
        {routeTieCenter()}
        {routeIOCenter()}
        {routeMy}
        {routePermits}
    </>;
    return <>
        <Route path={`${pathHome}/*`}>
            {routes}
        </Route>
        <Route path={`/*`}>
            {routes}
        </Route>
    </>;
}
