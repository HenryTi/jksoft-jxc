import { EntitySheet } from "../../Biz";
import { ControllerBiz, ControllerEntity } from "../../Controller";

export class ControllerSheetList extends ControllerEntity<EntitySheet> {
    constructor(controllerBiz: ControllerBiz, entitySheet: EntitySheet) {
        super(controllerBiz, entitySheet);
        console.log('ControllerSheet', entitySheet.caption, this.keyId);
    }
}
