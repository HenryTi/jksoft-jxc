import { UqApp } from "app/UqApp";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { Detail, Sheet } from "uqs/UqDefault";
import { GenInput, GenProps } from "app/tool";
import { Editing } from "./Editing";
import { BizSheet } from "app/Biz";

export abstract class GenSheet extends GenInput {
    abstract get sheetName(): string;
    get bizSheet(): BizSheet { return this.biz.sheets[this.sheetName] }
    get caption() {
        let { name, caption } = this.bizSheet;
        return caption ?? name;
    }
    get typePhrase() {
        let { name, type } = this.bizSheet;
        return `${type}.${name}`;
    }
    abstract get targetCaption(): string;

    readonly ID: UqID<Sheet>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;

    abstract get ModalSheetStart(): (props: GenProps<GenSheet>) => JSX.Element;
    abstract get ViewItemEditRow(): (props: { row: any; Gen: new (uqApp: UqApp) => GenSheet }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract buildDetailFromSelectedItem: (selectedItem: any) => any;
    abstract get editing(): Editing;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;
        this.ID = uq.Sheet;
        this.QueryGetDetails = uq.GetDetails;
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
