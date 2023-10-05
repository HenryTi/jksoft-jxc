import { EntityReport } from "app/Biz";
import { Page } from "tonwa-app";

export function PageReport({ entityReport }: { entityReport: EntityReport; }) {
    return <Page header={entityReport.caption ?? entityReport.name}>
        <div className="p-3">{entityReport.caption ?? entityReport.name}</div>
    </Page>;
}

