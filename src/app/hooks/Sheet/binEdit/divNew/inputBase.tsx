import { PendInput } from "app/Biz";
import { Modal } from "tonwa-app";
import { UqApp } from "app";
import { DivStore, NamedResults, PendRow } from "../../store";

export interface InputProps<T extends PendInput = any> {
    divStore: DivStore;
    pendRow: PendRow;
    namedResults: NamedResults;
    binInput: T;
    uqApp: UqApp;
    modal: Modal;
}
