import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { PageHistory, PageSheetList, PageSheets, RouteReportDash, pathReport, pathSheetRef, pathSheets, pathSheetsList, useReport } from "app/hooks";
import React from "react";
import { FA, Sep } from "tonwa-com";
import { EntityReport } from "tonwa";
import { path } from "app/tool";
import { PageRef, headerSheets } from "app/hooks";
import { centers } from "app/views/center";

function PageReportCenter() {
    const { biz } = useUqApp();
    const { reports } = biz;

    function ViewItemReport({ value }: { value: EntityReport }) {
        const { id, caption, name } = value;

        return <Link to={`../${pathReport(id)}`}>
            <div className="py-3 pe-3">
                <FA name="id-card-o" className="mx-4" />
                {caption ?? name}
            </div>
        </Link>
    }

    return <Page header={centers.report.caption}>
        <div className="mb-3">
            <Link to={`../${pathSheets}`}>
                <div className="pe-3 py-3">
                    <FA name="address-card-o" className="mx-4 text-info" />
                    {headerSheets}
                </div>
            </Link>
            <Sep sep={2} />
            {reports.map(v => {
                return <React.Fragment key={v.id}>
                    <ViewItemReport value={v} />
                    <Sep />
                </React.Fragment>;
            })}
        </div>
    </Page>;
}

function PageReport() {
    let { page } = useReport();
    return page;
}

const report = 'report';

export function routeReportCenter() {
    const n = ':report';
    return <>
        <Route path={centers.report.path} element={<PageReportCenter />} />
        <Route path={`${report}/:report`} element={<RouteReportDash />} />
        <Route path={pathReport(n)} element={<PageReport />} />
        <Route path={path('history', 'title', 'id')} element={<PageHistory />} />
        <Route path={path(pathSheetRef, 'id', 'd')} element={<PageRef />} />
        <Route path={path(pathSheetRef, 'id', undefined)} element={<PageRef />} />
        <Route path={path(pathSheets, undefined, undefined)} element={<PageSheets />} />
        <Route path={path(pathSheetsList, 'sheet62', undefined)} element={<PageSheetList />} />
    </>;
}
