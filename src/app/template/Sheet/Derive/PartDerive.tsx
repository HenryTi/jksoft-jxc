import { UqID, UqQuery } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp } from "app/UqApp";
import { PartSheet } from "../PartSheet";
import { DetailBase, SheetBase } from '../EditingBase';
import { PageDeriveSelect } from "./PageDeriveSelect";
import { ViewEditRow } from "./ViewEditRow";
import { EditingDerive } from "./EditingDerive";

export abstract class PartDerive<S extends SheetBase, D extends DetailBase> extends PartSheet<S, D> {
    readonly origin: PartSheet<SheetBase, DetailBase>;

    readonly IDDetail: UqID<any>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    // readonly QuerySearchSheetItem: UqQuery<any, any>;
    abstract QueryOrigin: UqQuery<any, any>;

    readonly ModalSheetStart: (props: PartProps<PartSheet<S, D>>) => JSX.Element;
    //readonly PageDetailItemSelect: () => JSX.Element;
    readonly ViewItemEditRow: (props: { row: any, Part: new (uqApp: UqApp) => PartSheet<S, D> }) => JSX.Element;

    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;
    readonly editing: EditingDerive<S, any>;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.origin = this.getOriginSheetPart();

        let uq = this.uq;
        this.IDDetail = uq.Detail;
        this.QueryGetDetails = uq.GetDetailQPAs;
        this.ModalSheetStart = PageDeriveSelect as any;
        this.ViewItemEditRow = ViewEditRow as any;
        this.editing = new EditingDerive(this);
    }

    protected abstract getOriginSheetPart(): PartSheet;

    buildDetailFromSelectedItem = (selectedItem: any): any => {
        return undefined;
    }
}
