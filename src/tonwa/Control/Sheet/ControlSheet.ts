import { EntitySheet } from "../../Biz";
import { StoreSheet, SheetMainStore, BinStore } from "../../Store";
import { ControlBiz, ControlEntity as ControlEntity } from "..";

enum PendLoadState {
    none,
    loading,
    loaded,
}
export enum SubmitState {
    none,
    disable,
    enable,
}
export enum EnumSheetEditReturn {
    submit,
    exit,
    discard,
}

export abstract class ControlSheet extends ControlEntity<EntitySheet> {
    readonly storeSheet: StoreSheet
    readonly mainStore: SheetMainStore;
    readonly binStore: BinStore;

    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        this.storeSheet = new StoreSheet(controlBiz.storeBiz, entitySheet);
        this.mainStore = this.storeSheet.mainStore; // new SheetMainStore(this.storeSheet);
        this.binStore = this.storeSheet.binStore;
    }
    async discard() {
        await this.storeSheet.discard();
    }
}
