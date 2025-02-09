import { JSX } from "react";
import { Modal } from "../UI";
import { Biz } from "../Biz";
import { KeyIdObject } from "../Store";

export class Controller extends KeyIdObject {
    readonly modal: Modal;
    readonly biz: Biz;
    constructor(modal: Modal, biz: Biz) {
        super();
        this.modal = modal;
        this.biz = biz;
    }

    async openModal(element: JSX.Element, onClosed?: (result: any) => void) {
        return await this.modal.open(element, onClosed);
    }

    closeModal(result?: any) {
        this.modal.close(result);
    }
}
