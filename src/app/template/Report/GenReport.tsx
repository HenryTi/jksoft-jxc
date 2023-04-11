import { UqQuery } from "tonwa-uq";
import { Gen, GenBizEntity, QueryMore } from "app/tool";
import { EntitySubject } from "app/Biz";

export abstract class GenReport extends GenBizEntity {
    get bizSubject(): EntitySubject { return this.biz.subjects[this.bizEntityName]; }

    protected abstract get QueryReport(): UqQuery<any, any>;
    protected abstract get QueryHistory(): UqQuery<any, any>;

    abstract get sortField(): string;
    abstract get ViewItem(): (props: { value: any }) => JSX.Element;

    abstract get captionHistory(): string;
    abstract get ViewItemHistory(): (props: { value: any }) => JSX.Element;
    abstract get historySortField(): string;
    // abstract get onHistoryClick(): (item: any) => Promise<void>;

    abstract get pathStorageHistory(): string;
    abstract get pathStorageDetail(): string;
    abstract get pathStorageSheet(): string;

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
}
