import { EntityDetail } from "app/Biz/EntitySheet";
import { GenBizEntity } from "app/tool";
import { GenEditing } from "./GenEditing";
import { Atom } from "uqs/UqDefault";
import { EditingRow, SheetRow } from "./Model";

export abstract class GenDetail extends GenBizEntity<EntityDetail> {
    readonly bizEntityType = 'detail';
    get entity(): EntityDetail { return this.biz.details[this.bizEntityName] }
    abstract get addRow(): (genEditing: GenEditing) => Promise<SheetRow[]>;
    abstract get editRow(): (genEditing: GenEditing, editingRow: EditingRow) => Promise<void>;
    abstract get ViewRow(): (props: { editingRow: EditingRow; genEditing: GenEditing }) => JSX.Element;
    abstract get selectTarget(): (header?: string) => Promise<Atom>;
    abstract get selectItem(): (header?: string) => Promise<Atom>;
}
