import { pathAssignCenter } from "app/views/pathes";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";

export function PageAssignCenter() {
    return <Page header="赋值中心">
    </Page>;
}

export function routeAssignCenter() {
    const n = ':atom';
    return <>
        <Route path={pathAssignCenter} element={<PageAssignCenter />} />
    </>;
}
