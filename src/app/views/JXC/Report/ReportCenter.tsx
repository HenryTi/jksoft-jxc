import { UqApp, useUqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { ViewItemReport, pathReport, pathReportList, useReport } from "app/hooks";
import { useReportOne } from "app/hooks/Report/useReportOne";

export const pathReportCenter = 'report';

function PageReportCenter() {
    const { biz } = useUqApp();
    const { reports } = biz;

    return <Page header="报表中心">
        <div className="mb-3">
            {reports.map(v => {
                return <ViewItemReport key={v.id} value={v} />;
            })}
        </div>
    </Page>;
}
/*
function PageReport() {
    let { page } = useReport();
    return page;
}
*/
function PageReportOne() {
    let { page } = useReportOne();
    return page;
}

export function routeReportCenter() {
    const n = ':report';
    return <>
        <Route path={pathReportCenter} element={<PageReportCenter />} />
        <Route path={pathReportList(n, ':listId')} element={<PageReportOne />} />
    </>;
}
