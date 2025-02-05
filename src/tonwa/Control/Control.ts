import { JSX } from "react";
import { Modal } from "../UI";
import { Biz } from "../Biz";
import { KeyIdObject } from "../Store";

export class Control extends KeyIdObject {
    readonly modal: Modal;
    readonly biz: Biz;
    constructor(modal: Modal, biz: Biz) {
        super();
        this.modal = modal;
        this.biz = biz;
    }

    async openModal<T>(element: JSX.Element, onClosed?: (result: any) => void) {
        return await this.modal.open<T>(element, onClosed);
    }

    async openModalAsync<T>(element: JSX.Element, promise: Promise<any>, onClosed?: (result: any) => void) {
        return await this.modal.openAsync<T>(element, promise, onClosed);
    }

    closeModal(result?: any) {
        this.modal.close(result);
    }
}
