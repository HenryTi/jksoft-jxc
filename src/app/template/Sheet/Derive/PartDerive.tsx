import { UqID, UqQuery } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp } from "app/UqApp";
import { PartSheet } from "../PartSheet";
import { PageDeriveSelect } from "./PageDeriveSelect";
import { ViewEditRow } from "./ViewEditRow";
import { EditingDerive } from "./EditingDerive";

export abstract class PartDerive extends PartSheet {
    readonly origin: PartSheet;

    abstract QueryOrigin: UqQuery<any, any>;

    readonly ModalSheetStart: (props: PartProps<PartSheet>) => JSX.Element;
    readonly ViewItemEditRow: (props: { row: any, Part: new (uqApp: UqApp) => PartSheet }) => JSX.Element;

    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;
    readonly editing: EditingDerive;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.origin = this.getOriginSheetPart();
        this.ModalSheetStart = PageDeriveSelect as any;
        this.ViewItemEditRow = ViewEditRow as any;
        this.editing = new EditingDerive(this);
    }

    protected abstract getOriginSheetPart(): PartSheet;

    buildDetailFromSelectedItem = (selectedItem: any): any => {
        return undefined;
    }
}
