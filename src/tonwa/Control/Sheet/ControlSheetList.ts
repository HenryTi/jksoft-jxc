import { EntitySheet } from "../../Biz";
import { StoreSheet, StoreSheetMyList } from "../../Store";
import { ControlBiz, ControlEntity } from "../ControlBiz";

export abstract class ControlSheetList extends ControlEntity<EntitySheet> {
    readonly storeSheet: StoreSheet
    readonly myArchiveList: StoreSheetMyList;
    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        this.storeSheet = new StoreSheet(this.controlBiz.storeBiz, entitySheet);
        this.myArchiveList = new StoreSheetMyList(controlBiz.storeBiz, entitySheet);
        console.log('ControlSheet', entitySheet.caption, this.keyId);
    }
}
