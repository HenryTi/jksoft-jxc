import { UqQuery } from "tonwa-uq";
import { GenBizEntity, QueryMore } from "app/tool";
import { EntitySubject } from "app/Biz";
import { UqApp } from "app/UqApp";
import { Atom, ReturnHistoryStorage$page, ReturnReportStorage$page } from "uqs/UqDefault";
import { EasyTime, FA, LMR, dateFromMinuteId } from "tonwa-com";
import { IDView } from "tonwa-app";

export abstract class GenSubject extends GenBizEntity<EntitySubject> {
    readonly bizEntityType: 'subject';
    // get entity(): EntitySubject { return this.biz.subjects[this.bizEntityName]; }

    readonly QueryReport: UqQuery<any, any>;
    readonly QueryHistory: UqQuery<any, any>;
    readonly sortField: string;
    readonly historySortField: string;

    abstract get captionHistory(): string;
    abstract get pathStorageHistory(): string;
    abstract get pathDetailView(): string;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.QueryReport = this.uq.ReportStorage;
        this.sortField = 'atom';
        this.QueryHistory = this.uq.HistoryStorage;
        this.historySortField = 'id';
    }

    searchSubjectAtom: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let nParam = {
            key: param?.key,
            subject: this.entity.phrase,
        }
        const { $page } = await this.QueryReport.page(nParam, pageStart, pageSize);
        return $page;
    }

    subjectHistory: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let nParam = {
            atomId: param.atomId,
            subject: this.entity.phrase,
        }
        const { $page } = await this.QueryHistory.page(nParam, pageStart, pageSize);
        return $page;
    }

    readonly ViewItem = ({ value: row, clickable }: { value: ReturnReportStorage$page; clickable?: boolean; }): JSX.Element => {
        const { obj, value, init } = row;
        function ViewProduct({ value: { ex, no } }: { value: Atom }) {
            return <div>
                <small className="text-muted">{no}</small>
                <div><b>{ex}</b></div>
            </div>
        }
        let icon = clickable === false ? '' : 'angle-right';
        return <LMR className="px-3 py-2 align-items-center">
            <IDView uq={this.uq} id={obj} Template={ViewProduct} />
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value + init).toFixed(0)}</div>
                <FA name={icon} className="text-muted" fixWidth={true} />
            </div>
        </LMR>;
    }

    readonly ViewItemHistory = ({ value: row }: { value: ReturnHistoryStorage$page }): JSX.Element => {
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
}
