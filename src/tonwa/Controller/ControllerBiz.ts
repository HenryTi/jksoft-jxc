import { Modal } from "../UI";
import { Biz, Entity } from "../Biz";
import { StoreBiz } from "../Store";
import { Controller } from "./Controller";

export class ControllerBiz extends Controller {
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

export class ControllerBase extends Controller {
    readonly controllerBiz: ControllerBiz;
    constructor(controllerBiz: ControllerBiz) {
        const { modal, biz } = controllerBiz
        super(modal, biz);
        this.controllerBiz = controllerBiz;
    }
}

export abstract class ControllerEntity<T extends Entity> extends ControllerBase {
    readonly entity: T;
    constructor(controllerBiz: ControllerBiz, entity: T) {
        super(controllerBiz);
        this.entity = entity;
    }
}
