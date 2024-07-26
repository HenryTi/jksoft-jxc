import { BinInput } from "app/Biz";
// import { Modal } from "tonwa-app";
// import { UqApp } from "app";
import { DivEditing, PendRow } from "../../store";
// import { Editing } from "app/hooks";

export interface InputProps<T extends BinInput = any> {
    editing: DivEditing;
    // divStore: BinStore;
    // valDiv: ValDivBase;
    pendRow: PendRow;
    // namedResults: NamedResults;
    binInput: T;
    // uqApp: UqApp;
    // modal: Modal;
}
