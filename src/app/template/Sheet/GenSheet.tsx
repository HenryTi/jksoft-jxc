import { UqApp } from "app/UqApp";
import { Sheet } from "uqs/UqDefault";
import { GenBizEntity, GenProps } from "app/tool";
import { GenEditing } from "./GenEditing";
import { BizSheet } from "app/Biz";

export abstract class GenSheet extends GenBizEntity {
    readonly bizEntityType = 'sheet';
    get path() { return this.bizEntityName; }
    get bizSheet(): BizSheet { return this.biz.sheets[this.bizEntityName] }
    get caption() {
        let { name, caption } = this.bizSheet;
        return caption ?? name;
    }
    get phrase() {
        let { name, type } = this.bizSheet;
        return `${type}.${name}`;
    }
    abstract get targetCaption(): string;

    // readonly Atom: UqID<Sheet>;

    abstract get ModalSheetStart(): (props: GenProps<GenSheet>) => JSX.Element;
    abstract get ViewItemEditRow(): (props: { row: any; Gen: new (uqApp: UqApp) => GenSheet }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract buildDetailFromSelectedAtom: (selectedItem: any) => any;
    abstract get genEditing(): GenEditing;

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
