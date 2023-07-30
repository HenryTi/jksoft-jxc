import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { ViewPeriodHeader } from "./ViewPeriodHeader";
import { ViewSubjects } from "./ViewSubjects";

export const pathMy = 'my';

export function PageMy() {
    return <Page header="我的">
        <div className="d-flex flex-wrap p-2 justify-content-center">
            <ViewSubjects />
        </div>
        <ViewPeriodHeader />
    </Page>;
}

export const routeMy = <Route path={pathMy} element={<PageMy />} />;
