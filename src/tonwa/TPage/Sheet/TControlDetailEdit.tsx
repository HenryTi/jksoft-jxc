import { BinRow, EntityBin } from "../../Biz";
import { ControlDetailEdit } from "../../Control";
import { BinEditing } from "../../Control/ControlBuds/BinEditing";
import { PageEditDivRoot } from "./PageEditDivRoot";
import { ValDivBase } from "../../Store/ValDiv";
import { JSX } from "react";
import { PageInputRow } from "./PageInputRow";
import { TControlBinPicks } from "./TControlBinPicks";

export class TControlDetailEdit extends ControlDetailEdit {
    protected override PageEditDivRoot(valDiv: ValDivBase): JSX.Element {
        return <PageEditDivRoot control={this} valDiv={valDiv} />;
    }
    override createControlPinPicks(entityBin: EntityBin, initBinRow?: BinRow) {
        return new TControlBinPicks(this.controlBiz, this.controlSheet.storeSheet, entityBin, initBinRow);
    }

    protected override PageInputRow(binEditing: BinEditing, valDiv: ValDivBase): JSX.Element {
        return <PageInputRow binEditing={binEditing} valDiv={valDiv} />;
    }
}
