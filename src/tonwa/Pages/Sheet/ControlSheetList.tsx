import { EntitySheet } from "../../Biz";
import { ControlBiz, ControlEntity } from "../../Control";

export class ControllerSheetList extends ControlEntity<EntitySheet> {
    constructor(controllerBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controllerBiz, entitySheet);
        console.log('ControllerSheet', entitySheet.caption, this.keyId);
    }
}
