import { EntitySheet } from "../../Biz";
import { StoreSheet, SheetMainStore, BinStore } from "../../Store";
import { ControlBiz, ControlDetailEdit, ControlEntity as ControlEntity } from "../../Control";
import { atom } from "jotai";
import { setAtomValue } from "../../tools";
import { JSX } from "react";

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
    readonly atomReaction = atom(undefined as any);
    readonly atomError = atom(undefined as { [id: number]: { pend: number; overValue: number; } | { bin: number; message: string; } });
    readonly atomSum = atom(get => {
        return this.binStore.sum(get);
    });

    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        this.storeSheet = new StoreSheet(controlBiz.storeBiz, entitySheet);
        this.mainStore = this.storeSheet.mainStore; // new SheetMainStore(this.storeSheet);
        this.binStore = this.storeSheet.binStore;
    }
    async discard() {
        await this.storeSheet.discard();
    }

    atomSubmitState = atom((get) => {
        if (this.binStore === undefined) return SubmitState.enable;
        return get(this.binStore.atomSubmitState);
    }, null);

    async load(id: number) {
        await this.storeSheet.load(id);
    }

    protected checkTrigger() {
        console.error('if (mainStore.trigger() === false) return false;');
        // if (this.mainStore.trigger() === false) return false;
        if (this.binStore !== undefined) {
            if (this.binStore.trigger() === false) return false;
        }
        return true;
    }

    async onSubmitDebug() {
        let { checkPend, checkBin, logs } = await this.storeSheet.submitDebug();
        let error: string = '';
        if (checkPend.length + checkBin.length > 0) {
            if (checkPend.length > 0) {
                error += `checkPend: ${JSON.stringify(checkPend)}\n`;
            }
            if (checkBin.length > 0) {
                error += `checkBin: ${JSON.stringify(checkBin)}\n`;
            }
            // alert(error);
            // store.setSubmitError(checkPend, checkBin);
            // return;
        }
        return { error, logs };
    }

    notifyRowChange() { }
}
