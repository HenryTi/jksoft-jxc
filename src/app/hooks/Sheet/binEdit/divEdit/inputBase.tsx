import { BinInput } from "tonwa";
import { DivEditing, PendRow } from "../../../../Store";

export interface InputProps<T extends BinInput = any> {
    editing: DivEditing;
    pendRow: PendRow;
    binInput: T;
}
