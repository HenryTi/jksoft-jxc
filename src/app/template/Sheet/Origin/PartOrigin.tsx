import { UqApp } from "app/UqApp";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { DetailQPA } from "uqs/JsTicket";
import { PartProps } from "../../Part";
import { PartSheet } from "../PartSheet";
import { DetailQuantityBase, SheetBase } from '../EditingBase';
import { EditingOrigin } from "./EditingOrigin";
import { PageOriginNew } from "./PageOriginNew";

export abstract class PartOrigin<S extends SheetBase, D extends DetailQuantityBase> extends PartSheet<S, D> {
    abstract pathNew: string;
    abstract pathEdit: string;

    abstract IDDetail: UqID<DetailQPA>;
    abstract QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    abstract get ActBookSheet(): UqAction<any, any>;
    abstract get QuerySearchSheetItem(): UqQuery<any, any>;

    abstract PageDetailItemSelect: () => JSX.Element;
    // abstract ModalSheetEdit: (props: { id: number }) => JSX.Element;
    abstract PageSheetEdit: () => JSX.Element;
    // abstract PageSheetNew: () => JSX.Element;
    abstract ViewNO: (props: { no: string }) => JSX.Element;
    abstract ViewItemEditRow: ({ row }: { row: any; }) => JSX.Element;

    readonly ModalSheetStart: (props: PartProps<PartSheet<S, D>>) => JSX.Element;
    declare readonly editing: EditingOrigin<S, D>;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;

        this.ModalSheetStart = PageOriginNew as any;
        this.editing = new EditingOrigin(this);
    }
}
