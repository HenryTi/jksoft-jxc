import { Modal } from "../UI";
import { Biz, Entity } from "../Biz";
import { StoreBiz } from "../Store";
import { Control } from "./Control";
import { PageCmdLog } from "tonwa/TPage/PageLog";
import { JSX } from "react";

export abstract class ControlBiz extends Control {
    readonly storeBiz: StoreBiz;
    constructor(modal: Modal, biz: Biz) {
        super(modal, biz);
        this.storeBiz = new StoreBiz(modal, biz);
    }
    async loadUserDefaults() {
        return await this.storeBiz.loadUserDefaults();
    }

    onPageCmdLog = async () => {
        this.openModal(this.PageCmdLog());
    }

    protected abstract PageCmdLog(): JSX.Element;
}

export class ControlBaseWithBiz extends Control {
    readonly controlBiz: ControlBiz;
    constructor(controlBiz: ControlBiz) {
        const { modal, biz } = controlBiz
        super(modal, biz);
        this.controlBiz = controlBiz;
    }
}

export abstract class ControlEntity<T extends Entity> extends ControlBaseWithBiz {
    readonly entity: T;
    constructor(controlBiz: ControlBiz, entity: T) {
        super(controlBiz);
        this.entity = entity;
    }
}
