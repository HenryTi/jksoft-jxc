import { EntitySheet } from "../../Biz";
import { ControlBiz, ControlSheetList } from "../../Control";

export class TControlSheetList extends ControlSheetList {
    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        console.log('ControlSheet', entitySheet.caption, this.keyId);
    }
}
