import { EntityReport, ReportList } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { Page } from "tonwa-app";
import { Link, useParams } from "react-router-dom";
import { List, from62, to62 } from "tonwa-com";
// import { useBizAtomSpec } from "app/views/JXC/Atom";

export interface OptionsUseSubject {
    title: string; // EnumTitle;
    bud: string;
}

function reportInPath(phraseId: number | string) {
    if (typeof phraseId === 'string') {
        if (phraseId !== ':report' && phraseId !== ':listId') debugger;
        return phraseId;
    }
    return to62(phraseId);
}

export function pathReport(phraseId: number | string) {
    return `report/${reportInPath(phraseId)}`;
}

export function pathReportList(phraseId: number | string, listId: number | string) {
    return `report/${reportInPath(phraseId)}/${reportInPath(listId)}`;
}

export function pathSubjectHistory(title: string /*EnumTitle*/) {
    return `${title}-history`;
}

export interface ReturnUseReport {
    view: JSX.Element;
}

export function useReport(): ReturnUseReport {
    const { report } = useParams();
    let phraseId = from62(report);
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entityIds[phraseId] as EntityReport;
    const { lists } = entity;

    function ViewItem({ value }: { value: ReportList }) {
        const { name, caption, entity } = value;
        return <Link to={name}>
            <div className="px-3 py-3">
                {caption ?? name}
            </div>
        </Link>;
    }

    function PageReport() {
        return <div >
            <div>{entity.caption ?? entity.name}</div>
            <List items={lists} ViewItem={ViewItem} />
        </div>;
    }

    return {
        view: <PageReport />,
    }
}
