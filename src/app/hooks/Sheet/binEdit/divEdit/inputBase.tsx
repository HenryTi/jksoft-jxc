import { BinInput } from "app/Biz";
import { DivEditing, PendRow } from "../../store";

export interface InputProps<T extends BinInput = any> {
    editing: DivEditing;
    pendRow: PendRow;
    binInput: T;
}
