import { Modal } from "../UI";
import { Biz, Entity } from "../Biz";
import { StoreBiz } from "../Store";
import { Control } from "./Control";

export class ControlBiz extends Control {
    readonly storeBiz: StoreBiz;
    constructor(modal: Modal, biz: Biz) {
        super(modal, biz);
        this.storeBiz = new StoreBiz(modal, biz);
    }
    async loadUserDefaults() {
        return await this.storeBiz.loadUserDefaults();
    }

    onPageCmdLog = async () => {
        // this.openModal(<PageCmdLog />);
        alert('this.openModal(<PageCmdLog />)');
    }
}

export class ControlBaseWithBiz extends Control {
    readonly controlBiz: ControlBiz;
    constructor(controllerBiz: ControlBiz) {
        const { modal, biz } = controllerBiz
        super(modal, biz);
        this.controlBiz = controllerBiz;
    }
}

export abstract class ControlEntity<T extends Entity> extends ControlBaseWithBiz {
    readonly entity: T;
    constructor(controllerBiz: ControlBiz, entity: T) {
        super(controllerBiz);
        this.entity = entity;
    }
}
