import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { ViewPeriodTop } from "./ViewPeriodTop";

export const pathMy = 'my';

export function PageMy() {
    return <Page header="我的">
        <ViewPeriodTop />
    </Page>;
}

export const routeMy = <Route path={pathMy} element={<PageMy />} />;
