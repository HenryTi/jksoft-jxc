import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { PartStorage } from "./ReportStorage";

export const pathReportCenter = 'report';

function PageReportCenter() {
    const uqApp = useUqApp();
    const parts = [PartStorage].map(v => uqApp.partOf(v));
    return <Page header="报表中心">
        {parts.map((v, index) => {
            const { path, caption } = v;
            return <Link key={index} to={`../${path}`} className="px-3 py-2 border-bottom align-items-center">
                {caption}
            </Link>;
        })}
    </Page>;
}

export const routeReportCenter = <Route path={pathReportCenter} element={<PageReportCenter />} />;
