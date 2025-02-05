import { atom } from "jotai";
import { BinRow, EntityBin, EntitySheet, EnumDetailOperate } from "../../Biz";
import { StoreSheet, SheetMainStore, BinStore, SheetSteps, BinStorePendDirect } from "../../Store";
import { ControlBiz, ControlEntity as ControlEntity } from "../../Control";
import { ReturnUseBinPicks } from "../../Store/PickResult";
import { ControlBinPicks } from "../../Control/ControlBuds";
import { setAtomValue, getAtomValue } from "../../tools";
import { WritableAtom } from "jotai";

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

export class TControlSheet extends ControlEntity<EntitySheet> {
    readonly storeSheet: StoreSheet
    readonly mainStore: SheetMainStore;
    readonly binStore: BinStore;

    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        this.storeSheet = new StoreSheet(controlBiz.storeBiz, entitySheet);
        this.mainStore = new SheetMainStore(this.storeSheet);
        this.binStore = this.storeSheet.binStore;
        console.log('ControlSheet', entitySheet.caption, this.keyId);
    }
    async discard() {
        await this.storeSheet.discard();
    }
}
