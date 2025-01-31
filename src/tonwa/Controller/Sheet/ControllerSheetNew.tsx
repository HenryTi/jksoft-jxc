import { Modal } from "../../UI";
import { Biz, EntitySheet } from "../../Biz";
import { Controller } from "../Controller";
import { ControllerSheetDash } from "./ControllerSheetDash";

export class ControllerSheetNew extends Controller {
    readonly entitySheet: EntitySheet;
    constructor(controllerSheetDash: ControllerSheetDash) {
        const { modal, biz, entitySheet } = controllerSheetDash;
        super(modal, biz);
        this.entitySheet = entitySheet;
        console.log('ControllerSheetNew', entitySheet.caption, this.keyId);
    }
}

