import { Modal } from "tonwa-app";
import { UqExt } from "uqs/UqDefault";

export abstract class Console {
    readonly uq: UqExt;
    protected readonly modal: Modal;

    constructor(uq: UqExt, modal: Modal) {
        this.uq = uq;
        this.modal = modal;
    }

}