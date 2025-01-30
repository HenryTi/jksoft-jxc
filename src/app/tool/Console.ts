import { Modal } from "tonwa-app";
// import { UqExt } from "uqs/UqDefault";

export abstract class Console {
    // readonly uq: UqExt;
    readonly modal: Modal;

    constructor(modal: Modal) {
        // this.uq = uq;
        this.modal = modal;
    }

}