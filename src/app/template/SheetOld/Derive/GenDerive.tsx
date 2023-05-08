import { GenProps } from "app/tool";
import { UqApp } from "app/UqApp";
import { GenSheetOld } from "../GenSheetOld";
import { PageDeriveSelect } from "./PageDeriveSelect";
import { ViewEditRow } from "./ViewEditRow";
import { GenEditingDerive } from "./GenDeriveEditing";

export abstract class GenDerive extends GenSheetOld {
    readonly origin: GenSheetOld;

    readonly ModalSheetStart: (props: GenProps<GenSheetOld>) => JSX.Element;
    readonly ViewItemEditRow: (props: { row: any, Gen: new (uqApp: UqApp) => GenSheetOld }) => JSX.Element;

    readonly ViewItemSource: ({ id }: { id: number; }) => JSX.Element;
    readonly sourceSearchPlaceholder: string;
    readonly genEditing: GenEditingDerive;

    detailFromOrigin(originDetail: any): any {
        let { id, item, value, done } = originDetail;
        return {
            origin: id,
            item,
            originValue: value,
            done,
        }
    }

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.origin = this.getOriginSheetGen();
        this.ModalSheetStart = PageDeriveSelect as any;
        this.ViewItemEditRow = ViewEditRow as any;
        this.genEditing = new this.GenEditingDerive(this);
    }

    protected get GenEditingDerive(): new (genDerive: GenDerive) => GenEditingDerive { return GenEditingDerive; }
    protected abstract getOriginSheetGen(): GenSheetOld;

    buildDetailFromSelectedAtom = (selectedItem: any): any => {
        return undefined;
    }

    loadPend = async (param: any, pageStart: any, pageSize: number) => {
        let { $page } = await this.uq.GetPendSheet.page({ sheet: this.entity.phrase }, pageStart, pageSize);
        return $page;
    }
}
