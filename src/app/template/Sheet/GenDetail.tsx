import { EntityDetail } from "app/Biz/EntitySheet";
import { GenBizEntity } from "app/tool";
import { EditingDetail } from "./EditingDetail";
import { GenEditing } from "./GenEditing";

export abstract class GenDetail extends GenBizEntity<EntityDetail> {
    readonly bizEntityType = 'detail';
    get entity(): EntityDetail { return this.biz.details[this.bizEntityName] }
    abstract addRow(genEditing: GenEditing): Promise<EditingDetail[]>;
    abstract editRow(genEditing: GenEditing, detail: EditingDetail): Promise<void>;
    abstract get ViewDetail(): (props: { editingDetail: EditingDetail; genEditing: GenEditing }) => JSX.Element;
    async selectTarget(header?: string): Promise<number> {
        return undefined;
    }
}
