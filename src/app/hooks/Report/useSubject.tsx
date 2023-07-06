import { UqQuery } from "tonwa-uq";
import { QueryMore } from "app/tool";
import { EntitySubject } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { Atom, EnumSubject, ReturnHistoryStorage$page, ReturnReportStorage$page } from "uqs/UqDefault";
import { EasyTime, FA, LMR, dateFromMinuteId } from "tonwa-com";
import { IDView } from "tonwa-app";

export interface OptionsUseSubject {
    subject: EnumSubject;
}

export function pathSubjectHistory(subject: EnumSubject) {
    return `${subject}-history`;
}

export interface ReturnUseSubject {
    searchSubjectAtom: QueryMore;
    subjectHistory: QueryMore;
    ViewItem: (props: { value: ReturnReportStorage$page; clickable?: boolean; }) => JSX.Element;
    ViewItemHistory: (props: { value: ReturnHistoryStorage$page }) => JSX.Element;
}

export function useSubject(options: OptionsUseSubject): ReturnUseSubject {
    const { subject: subjectName } = options;
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity: EntitySubject = biz.entities[subjectName] as EntitySubject;
    const QueryReport: UqQuery<any, any> = uq.ReportStorage;
    const QueryHistory: UqQuery<any, any> = uq.HistoryStorage;

    async function searchSubjectAtom(param: any, pageStart: any, pageSize: number) {
        let nParam = {
            key: param?.key,
            subject: entity.phrase,
        }
        const { $page } = await QueryReport.page(nParam, pageStart, pageSize);
        return $page;
    }

    async function subjectHistory(param: any, pageStart: any, pageSize: number) {
        let nParam = {
            atomId: param.atomId,
            subject: entity.phrase,
        }
        const { $page } = await QueryHistory.page(nParam, pageStart, pageSize);
        return $page;
    }

    function ViewItem({ value: row, clickable }: { value: ReturnReportStorage$page; clickable?: boolean; }): JSX.Element {
        const { obj, value, init } = row;
        function ViewProduct({ value: { ex, no } }: { value: Atom }) {
            return <div>
                <small className="text-muted">{no}</small>
                <div><b>{ex}</b></div>
            </div>
        }
        let icon = clickable === false ? '' : 'angle-right';
        return <LMR className="px-3 py-2 align-items-center">
            <IDView uq={uq} id={obj} Template={ViewProduct} />
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value + init).toFixed(0)}</div>
                <FA name={icon} className="text-muted" fixWidth={true} />
            </div>
        </LMR>;
    }

    function ViewItemHistory({ value: row }: { value: ReturnHistoryStorage$page }): JSX.Element {
        const { id, value, ref, sheetNo, sheetName, sheetCaption } = row;
        return <LMR className="px-3 py-2">
            <div className="w-8c me-3 small text-muted"><EasyTime date={dateFromMinuteId(id)} /></div>
            <div>
                {sheetCaption ?? sheetName} {sheetNo} - {ref}
            </div>
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" fixWidth={true} />
            </div>
        </LMR>;
    }

    return {
        searchSubjectAtom,
        subjectHistory,
        ViewItem,
        ViewItemHistory,
    }
}
