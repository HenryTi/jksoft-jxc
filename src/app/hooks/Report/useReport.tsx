import { EntityReport } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useParams } from "react-router-dom";
import { from62, to62 } from "tonwa-com";
import { PageReport } from "./PageReport";

export interface OptionsUseSubject {
    title: string;
    bud: string;
}

function reportInPath(phraseId: number | string) {
    if (typeof phraseId === 'string') {
        if (phraseId !== ':report') debugger;
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
    page: JSX.Element;
}

export const pathSheets = 'sheets';
export const pathSheetRef = 'ref';

export function useReport(): ReturnUseReport {
    const { report } = useParams();
    let phraseId = from62(report);
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const entity = biz.entityFromId<EntityReport>(phraseId);

    return {
        page: <PageReport entityReport={entity} />,
    }
}
