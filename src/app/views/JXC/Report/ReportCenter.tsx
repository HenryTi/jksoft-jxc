import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { PageHistory, pathReport, useReport } from "app/hooks";
import React from "react";
import { Sep } from "tonwa-com";
import { EntityReport } from "app/Biz";
import { path } from "app/tool";
import { PageRef } from "app/hooks/Report";
import { pathReportCenter } from "app/views/pathes";

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
        <Route path={path('ref', undefined, 'id')} element={<PageRef />} />
    </>;
}
