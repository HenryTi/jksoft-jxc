import { EntityReport } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { Page } from "tonwa-app";
import { useParams } from "react-router-dom";
import { from62 } from "tonwa-com";

export interface ReturnUseReportOne {
    page: JSX.Element;
}

export function useReportOne(): ReturnUseReportOne {
    const { report, listId: listIdOnUrl } = useParams();
    let phraseId = from62(report);
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entityReport = biz.entityIds[phraseId] as EntityReport;
    const { lists } = entityReport;
    const listId = from62(listIdOnUrl);
    const { name, caption, atom } = lists.find(v => v.id === listId);

    function PageReportOne() {
        return <Page header={caption ?? name}>
            <div className="p-3">
                {atom.name} {atom.caption}
            </div>
        </Page>;
    }

    return {
        page: <PageReportOne />,
    }
}
