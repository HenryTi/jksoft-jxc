import { BinInput } from "tonwa";
import { DivEditing, PendRow } from "../../store";

export interface InputProps<T extends BinInput = any> {
    editing: DivEditing;
    pendRow: PendRow;
    binInput: T;
}
