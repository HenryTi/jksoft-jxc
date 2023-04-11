import { UqQuery } from "tonwa-uq";
import { GenBizEntity, QueryMore } from "app/tool";
import { EntitySubject } from "app/Biz";
import { UqApp } from "app/UqApp";
import { Atom, ReturnReportStorage$page } from "uqs/UqDefault";
import { EasyTime, FA, LMR, dateFromMinuteId } from "tonwa-com";
import { IDView } from "tonwa-app";
import { DetailRef } from "app/views/JXC/SheetView";

export abstract class GenReport extends GenBizEntity {
    get bizSubject(): EntitySubject { return this.biz.subjects[this.bizEntityName]; }

    readonly QueryReport: UqQuery<any, any>;
    readonly QueryHistory: UqQuery<any, any>;
    readonly sortField: string;
    readonly historySortField: string;

    abstract get captionHistory(): string;
    abstract get pathStorageHistory(): string;

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
            subject: this.bizSubject.phrase,
        }
        const { $page } = await this.QueryReport.page(nParam, pageStart, pageSize);
        return $page;
    }

    subjectHistory: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let nParam = {
            atomId: param.atomId,
            subject: this.bizSubject.phrase,
        }
        const { $page } = await this.QueryHistory.page(nParam, pageStart, pageSize);
        return $page;
    }

    readonly ViewItem = ({ value: row }: { value: ReturnReportStorage$page; }): JSX.Element => {
        const { atom, value, init } = row;
        function ViewProduct({ value: { ex, no } }: { value: Atom }) {
            return <div>
                <small className="text-muted">{no}</small>
                <div><b>{ex}</b></div>
            </div>
        }
        return <LMR className="px-3 py-2 align-items-center">
            <IDView uq={this.uq} id={atom} Template={ViewProduct} />
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value + init).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" />
            </div>
        </LMR>;
    }

    readonly ViewItemHistory = ({ value: row }: { value: any }): JSX.Element => {
        const { id, value, ref } = row;
        return <LMR className="px-3 py-2">
            <div className="w-8c me-3 small text-muted"><EasyTime date={dateFromMinuteId(id)} /></div>
            <div><IDView uq={this.uq} id={ref} Template={DetailRef} /></div>
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" />
            </div>
        </LMR>
    }
}
