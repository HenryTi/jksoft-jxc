import { Biz, EntitySheet } from "../../Biz";
import { Modal } from "../../UI";
import { Controller } from "../Controller";
import { PageSheetNew } from "../../View";
import { ControllerSheetNew } from "./ControllerSheetNew";

export class ControllerSheetDash extends Controller {
    readonly entitySheet: EntitySheet;
    constructor(modal: Modal, biz: Biz, entitySheet: EntitySheet) {
        super(modal, biz);
        this.entitySheet = entitySheet;
        console.log('ControllerSheetDash', entitySheet.caption, this.keyId);
    }

    openPageSheetNew = async () => {
        const controllerSheetNew = new ControllerSheetNew(this)
        await this.modal.open(this.PageSheetNew(controllerSheetNew));
    }

    PageSheetNew(controllerSheetNew: ControllerSheetNew) {
        return <PageSheetNew controllerSheetNew={controllerSheetNew} />;
    }
}
