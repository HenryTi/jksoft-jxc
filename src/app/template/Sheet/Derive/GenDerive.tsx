import { UqID, UqQuery } from "tonwa-uq";
import { GenProps } from "app/tool";
import { UqApp } from "app/UqApp";
import { GenSheet } from "../GenSheet";
import { PageDeriveSelect } from "./PageDeriveSelect";
import { ViewEditRow } from "./ViewEditRow";
import { EditingDerive } from "./EditingDerive";

export abstract class GenDerive extends GenSheet {
    readonly origin: GenSheet;

    abstract QueryOrigin: UqQuery<any, any>;

    readonly ModalSheetStart: (props: GenProps<GenSheet>) => JSX.Element;
    readonly ViewItemEditRow: (props: { row: any, Gen: new (uqApp: UqApp) => GenSheet }) => JSX.Element;

    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;
    readonly editing: EditingDerive;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.origin = this.getOriginSheetGen();
        this.ModalSheetStart = PageDeriveSelect as any;
        this.ViewItemEditRow = ViewEditRow as any;
        this.editing = new EditingDerive(this);
    }

    protected abstract getOriginSheetGen(): GenSheet;

    buildDetailFromSelectedItem = (selectedItem: any): any => {
        return undefined;
    }
}
