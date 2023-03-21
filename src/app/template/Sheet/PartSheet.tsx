import { QueryMore } from "app/tool";
import { UqApp } from "app/UqApp";
import { UqAction, UqID, UqIX, UqQuery } from "tonwa-uq";
import { PartInput, PartProps } from "../Part";
import { DetailBase, Editing, SheetBase } from "./EditingBase";

export abstract class PartSheet<S extends SheetBase = any, D extends DetailBase = any> extends PartInput {
    readonly IxMySheet: UqIX<any>;

    readonly ID: UqID<S>;
    abstract get QueryGetDetails(): UqQuery<{ id: number }, { ret: any[] }>;
    abstract get IDDetail(): UqID<D>;
    abstract get ActBookSheet(): UqAction<any, any>;

    abstract get ModalSheetStart(): (props: PartProps<PartSheet<S, D>>) => JSX.Element;
    abstract get ViewItemEditRow(): (props: { row: any; Part: new (uqApp: UqApp) => PartSheet<S, D> }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: S; }) => JSX.Element;
    abstract get ViewTargetBand(): (props: { sheet: S; }) => JSX.Element;
    abstract buildDetailFromSelectedItem: (selectedItem: any) => any;
    abstract buildSheet(id: number, no: string, target: number): S;

    abstract get editing(): Editing<S>;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;
        this.IxMySheet = uq.IxMySheet;
        this.ID = uq.Sheet;
    }

    // 单据列表项显示
    ViewSheetListItem = ({ value }: { value: S }) => {
        return <div className="d-flex">
            <div className="me-3 w-4c text-secondary">{this.caption}</div>
            <div className="me-3 w-8c fw-bold">{value.no}</div>
            <this.ViewTarget sheet={value} />
        </div>
    }
}
