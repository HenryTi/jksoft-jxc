import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { PageHistory, PageSheetList, PageSheets, pathReport, pathSheetRef, pathSheets, pathSheetsList, useReport } from "app/hooks";
import React from "react";
import { Sep } from "tonwa-com";
import { EntityReport } from "app/Biz";
import { path } from "app/tool";
import { PageRef, headerSheets } from "app/hooks";
import { pathReportCenter } from "app/views/pathes";
// import { PageSheetList, PageSheets, headerSheets, pathSheetsList } from "../../../hooks/Report/PageSheets";

function PageReportCenter() {
    const { biz } = useUqApp();
    const { reports } = biz;

    function ViewItemReport({ value }: { value: EntityReport }) {
        const { id, caption, name } = value;

        return <Link to={`../${pathReport(id)}`}>
            <div className="px-3 py-3">{caption ?? name}</div>
        </Link>
    }

    return <Page header="报表中心">
        <div className="mb-3">
            <Link to={`../${pathSheets}`}>
                <div className="px-3 py-3">{headerSheets}</div>
            </Link>
            <Sep />
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

export function routeReportCenter() {
    const n = ':report';
    return <>
        <Route path={pathReportCenter} element={<PageReportCenter />} />
        <Route path={pathReport(n)} element={<PageReport />} />
        <Route path={path('history', 'title', 'id')} element={<PageHistory />} />
        <Route path={path(pathSheetRef, 'id', 'd')} element={<PageRef />} />
        <Route path={path(pathSheetRef, 'id', undefined)} element={<PageRef />} />
        <Route path={path(pathSheets, undefined, undefined)} element={<PageSheets />} />
        <Route path={path(pathSheetsList, 'sheet62', undefined)} element={<PageSheetList />} />
    </>;
}
