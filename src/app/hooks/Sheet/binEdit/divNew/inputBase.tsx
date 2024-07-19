import { BinInput } from "app/Biz";
// import { Modal } from "tonwa-app";
// import { UqApp } from "app";
import { BinStore, NamedResults, PendRow, ValDivBase } from "../../store";

export interface InputProps<T extends BinInput = any> {
    divStore: BinStore;
    valDiv: ValDivBase;
    pendRow: PendRow;
    namedResults: NamedResults;
    binInput: T;
    // uqApp: UqApp;
    // modal: Modal;
}
