import { UqQuery } from "tonwa-uq";
import { QueryMore } from "app/tool";
import { EntitySubject } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { EnumSubject, ReturnHistoryStorage$page, ReturnReportStorage$page } from "uqs/UqDefault";
import { EasyTime, FA, LMR, dateFromMinuteId } from "tonwa-com";
import { useBizAtomMetricSpec } from "app/views/JXC/Atom";

export interface OptionsUseSubject {
    subject: EnumSubject;
    bud: string;
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
    const { subject: subjectName, bud: budName } = options;
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity: EntitySubject = biz.entities[subjectName] as EntitySubject;
    const QueryReport: UqQuery<any, any> = uq.ReportStorage;
    const QueryHistory: UqQuery<any, any> = uq.HistoryStorage;

    async function searchSubjectAtom(param: any, pageStart: any, pageSize: number) {
        let nParam = {
            key: param?.key,
            subject: `${entity.phrase}.${budName}`,
        }
        const { $page } = await QueryReport.page(nParam, pageStart, pageSize);
        return $page;
    }

    async function subjectHistory(param: any, pageStart: any, pageSize: number) {
        let nParam = {
            objId: param.objId,
            subject: `${entity.phrase}.${budName}`,
        }
        const { $page } = await QueryHistory.page(nParam, pageStart, pageSize);
        return $page;
    }

    function ViewItem({ value: row, clickable }: { value: ReturnReportStorage$page; clickable?: boolean; }): JSX.Element {
        const { id, metricItem, spec, value, init } = row;
        const { viewAtom, viewMetricItem, viewSpec } = useBizAtomMetricSpec(id);
        let icon = clickable === false ? '' : 'angle-right';
        return <div className="d-flex py-2 ps-3">
            <div className="row flex-grow-1">
                <div className="col">{viewAtom}</div>
                <div className="col">{viewSpec}</div>
                <div className="col-2 fs-5 text-end">{(value + init).toFixed(0)} {viewMetricItem}</div>
            </div>
            <div className="text-end ms-3 me-1">
                <FA name={icon} className="text-muted" fixWidth={true} />
            </div>
        </div>;
    }

    function ViewItemHistory({ value: row }: { value: ReturnHistoryStorage$page }): JSX.Element {
        const { id, value, ref, op, sheetNo, sheetName, sheetCaption } = row;
        let opText: string;
        switch (op) {
            default:
            case 1: opText = ''; break;
            case -1: opText = '-'; break;
            case 0: opText = '='; break;
        }
        return <LMR className="px-3 py-2">
            <div className="w-8c me-3 small text-muted"><EasyTime date={dateFromMinuteId(id)} /></div>
            <div>
                {sheetCaption ?? sheetName} {sheetNo} - {ref}
            </div>
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{opText} {(value).toFixed(0)}</div>
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
