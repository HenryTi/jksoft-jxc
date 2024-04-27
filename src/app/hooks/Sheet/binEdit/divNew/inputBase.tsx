import { BinInput } from "app/Biz";
import { Modal } from "tonwa-app";
import { UqApp } from "app";
import { DivStore, NamedResults, PendRow, ValDivBase } from "../../store";

export interface InputProps<T extends BinInput = any> {
    divStore: DivStore;
    valDiv: ValDivBase;
    pendRow: PendRow;
    namedResults: NamedResults;
    binInput: T;
    uqApp: UqApp;
    modal: Modal;
}
