import { EntitySheet } from "../../Biz";
import { ControlBiz, ControlEntity } from "..";

export abstract class BControlSheetList extends ControlEntity<EntitySheet> {
    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        console.log('ControllerSheet', entitySheet.caption, this.keyId);
    }
}
