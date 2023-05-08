import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { GenSubjectStorage } from "./SubjectStorage";

export const pathReportCenter = 'report';

function PageSubjectCenter() {
    const uqApp = useUqApp();
    const gens = [GenSubjectStorage].map(v => uqApp.objectOf(v));
    return <Page header="报表中心">
        {gens.map((v, index) => {
            const { path, caption } = v;
            return <Link key={index} to={`../${path}`} className="px-3 py-2 border-bottom align-items-center">
                {caption}
            </Link>;
        })}
    </Page>;
}

export const routeSubjectCenter = <Route path={pathReportCenter} element={<PageSubjectCenter />} />;
