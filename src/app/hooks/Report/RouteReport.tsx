import { EntityReport, from62 } from "tonwa";
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
    const entityId = from62(entityId62);
    const entity = biz.entityFromId<EntityReport>(entityId);
    return entity;
}

