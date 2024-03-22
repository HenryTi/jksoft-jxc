import { PendInput } from "app/Biz";
import { DivEditProps } from "../store";
import { Modal } from "tonwa-app";
import { UqApp } from "app";

export interface InputProps<T extends PendInput = any> extends DivEditProps {
    binInput: T;
    uqApp: UqApp;
    modal: Modal;
}
