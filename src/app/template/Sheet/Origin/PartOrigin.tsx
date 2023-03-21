import { UqApp } from "app/UqApp";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { DetailQPA } from "uqs/UqDefault";
import { PartProps } from "../../Part";
import { PartSheet } from "../PartSheet";
import { DetailBase, SheetBase } from '../EditingBase';
import { EditingOrigin } from "./EditingOrigin";
import { PageOriginNew } from "./PageOriginNew";
import { BaseID, QueryMore } from "app/tool";

export abstract class PartOrigin<S extends SheetBase, D extends DetailBase> extends PartSheet<S, D> {
    /*
    abstract IDDetail: UqID<DetailQPA>;
    abstract QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    abstract get ActBookSheet(): UqAction<any, any>;
    */
    // abstract get QuerySearchSheetItem(): UqQuery<any, any>;

    readonly IDDetail: UqID<D>;
    readonly QueryGetDetails: UqQuery<{ id: number }, { ret: any[] }>;
    abstract QuerySearchItem: QueryMore;
    abstract PageDetailItemSelect: () => JSX.Element;
    abstract get PageSheetDetail(): <T extends PartSheet<S, D>>(props: (PartProps<T> & { detail: Partial<D>; })) => JSX.Element;
    // abstract ModalSheetEdit: (props: { id: number }) => JSX.Element;
    abstract PageSheetEdit: () => JSX.Element;
    // abstract PageSheetNew: () => JSX.Element;
    abstract ViewNO: (props: { no: string }) => JSX.Element;
    abstract ViewItemEditRow: ({ row }: { row: any; }) => JSX.Element;

    readonly ModalSheetStart: (props: PartProps<PartSheet<S, D>>) => JSX.Element;
    declare readonly editing: EditingOrigin<S, D>;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.ModalSheetStart = PageOriginNew as any;
        this.editing = new EditingOrigin(this);

        this.IDDetail = this.uq.DetailQPA;
        this.QueryGetDetails = this.uq.GetDetailQPAs;
    }
}
