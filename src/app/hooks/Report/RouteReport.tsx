import { EntityReport } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useParams } from "react-router-dom";
import { PageReportDash } from "./dash";

export function RouteReportDash() {
    const entityReport = useEntityReport();
    return <PageReportDash entityReport={entityReport} />;
}

function useEntityReport() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { report: entityId62, id } = useParams();
    const entity = biz.entityFrom62<EntityReport>(entityId62);
    return entity;
}

