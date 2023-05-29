import { UqApp } from "app/UqApp";
import { Sheet } from "uqs/UqDefault";
import { GenBizEntity, GenProps } from "app/tool";
import { GenEditingOld } from "./GenEditingOld";
import { EntitySheet } from "app/Biz";

export abstract class GenSheetOld extends GenBizEntity<EntitySheet> {
    // readonly bizEntityType = 'sheet';
    get path() { return this.bizEntityName; }
    //get entity(): EntitySheet { return this.biz.sheets[this.bizEntityName] }
    abstract get targetCaption(): string;

    // readonly Atom: UqID<Sheet>;

    abstract get ModalSheetStart(): (props: GenProps<GenSheetOld>) => JSX.Element;
    abstract get ViewItemEditRow(): (props: { row: any; Gen: new (uqApp: UqApp) => GenSheetOld }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract buildDetailFromSelectedAtom: (selectedItem: any) => any;
    abstract get genEditing(): GenEditingOld;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;
        // this.Atom = uq.Sheet;
    }

    // 单据列表项显示
    ViewSheetListItem = ({ value }: { value: Sheet }) => {
        return <div className="d-flex">
            <div className="me-3 w-4c text-secondary">{this.caption}</div>
            <div className="me-3 w-8c fw-bold">{value.no}</div>
            <this.ViewTarget sheet={value} />
        </div>
    }
}
