import { EntityDetail } from "app/Biz/EntitySheet";
import { GenBizEntity } from "app/tool";
import { EditingDetail } from "./EditingDetail";
import { GenEditing } from "./GenEditing";

export abstract class GenDetail extends GenBizEntity<EntityDetail> {
    readonly bizEntityType = 'detail';
    get entity(): EntityDetail { return this.biz.details[this.bizEntityName] }

    abstract addRow(): Promise<EditingDetail>;
    /* {
        const { openModal } = uqAppModal(this.uqApp);
        return await openModal(<this.PageDetail header={'新增明细'} />);
    }
    */

    abstract editRow(detail: EditingDetail): Promise<void>;
    /* {
        const { openModal } = uqAppModal(this.uqApp);
        return await openModal(<this.PageDetail header="修改明细" detail={detail} />);
    }

    protected abstract get PageDetail(): ({ header, detail }: { header?: string; detail?: Detail; }) => JSX.Element;
    abstract get ViewItemTop(): ({ item }: { item: number }) => JSX.Element;
    */

    abstract get ViewDetail(): (props: { editingDetail: EditingDetail; genEditing: GenEditing }) => JSX.Element;
}

