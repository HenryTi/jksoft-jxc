import { PendRow } from "../../Store";
import { BinInput } from "../../Biz";
import { DivEditing } from "../ControlBuds/BinEditing";
// import { DivEditing, PendRow } from "../../../../Store";

export interface InputProps<T extends BinInput = any> {
    editing: DivEditing;
    pendRow: PendRow;
    binInput: T;
}
