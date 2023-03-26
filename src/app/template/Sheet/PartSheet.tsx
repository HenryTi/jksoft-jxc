import { SeedSheet } from "app/tool";
import { UqApp } from "app/UqApp";
import { UqAction, UqID, UqIX, UqQuery } from "tonwa-uq";
import { Detail, Sheet } from "uqs/UqDefault";
import { PartInput, PartProps } from "../Part";
import { Editing } from "./EditingBase";

export abstract class PartSheet extends PartInput {
    abstract get sheetType(): string;

    readonly ID: UqID<Sheet>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    readonly IDDetail: UqID<Detail>;

    abstract get ActBookSheet(): UqAction<any, any>;

    abstract get ModalSheetStart(): (props: PartProps<PartSheet>) => JSX.Element;
    abstract get ViewItemEditRow(): (props: { row: any; Part: new (uqApp: UqApp) => PartSheet }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract buildDetailFromSelectedItem: (selectedItem: any) => any;
    abstract get editing(): Editing;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;
        this.ID = uq.Sheet;
        this.IDDetail = uq.Detail;
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
