import { BinInput } from "app/Biz";
// import { Modal } from "tonwa-app";
// import { UqApp } from "app";
import { BinStore, NamedResults, PendRow, ValDivBase } from "../../store";
import { Editing } from "app/hooks";

export interface InputProps<T extends BinInput = any> {
    divStore: BinStore;
    valDiv: ValDivBase;
    pendRow: PendRow;
    // namedResults: NamedResults;
    editing: Editing;
    binInput: T;
    // uqApp: UqApp;
    // modal: Modal;
}
