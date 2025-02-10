import { atom } from "jotai";
import { setAtomValue } from "../../tools";
import { ControlSheet, EnumSheetEditReturn, SubmitState } from "./ControlSheet";
import { ControlDetailEdit } from "./ControlDetailEdit";
import { ControlSheetDash } from "./ControlSheetDash";
import { JSX } from "react";

export abstract class ControlSheetEdit extends ControlSheet {
    protected readonly controlSheetDash: ControlSheetDash;
    readonly controlDetailEdit: ControlDetailEdit;
    readonly atomReaction = atom(undefined as any);
    readonly atomError = atom(undefined as { [id: number]: { pend: number; overValue: number; } | { bin: number; message: string; } });
    readonly atomSum = atom(get => {
        return this.binStore.sum(get);
    });
    constructor(controlSheetDash: ControlSheetDash) {
        const { controlBiz: controlBiz, entity: entitySheet } = controlSheetDash;
        super(controlBiz, entitySheet);
        this.controlSheetDash = controlSheetDash;
        this.controlDetailEdit = this.createControlDetailEdit();
    }

    protected abstract createControlDetailEdit(): ControlDetailEdit;

    atomSubmitState = atom((get) => {
        if (this.binStore === undefined) return SubmitState.enable;
        return get(this.binStore.atomSubmitState);
    }, null);

    private checkTrigger() {
        console.error('if (mainStore.trigger() === false) return false;');
        // if (this.mainStore.trigger() === false) return false;
        if (this.binStore !== undefined) {
            if (this.binStore.trigger() === false) return false;
        }
        return true;
    }

    async onSubmit() {
        if (this.checkTrigger() === false) {
            setAtomValue(this.atomReaction, this.ViewSubmitReaction());
            return;
        }
        await this.binStore?.deleteAllRemoved();
        let { checkPend, checkBin } = await this.storeSheet.submit();
        if (checkPend.length + checkBin.length > 0) {
            let error: string = '';
            if (checkPend.length > 0) {
                error += `checkPend: ${JSON.stringify(checkPend)}\n`;
            }
            if (checkBin.length > 0) {
                error += `checkBin: ${JSON.stringify(checkBin)}\n`;
            }
            // alert(error);
            this.setSubmitError(checkPend, checkBin);
            return;
        }
        // await this.controlSheetDash.onSubmited(store);
        // 转到 ControlSheetDash中操作
        // const { mainStore: main } = store;
        await this.controlBiz.storeBiz.client.triggerRefresh();
        this.closeModal(EnumSheetEditReturn.submit);
    }

    protected abstract ViewSubmitReaction(): JSX.Element;

    private setSubmitError(checkPend: { pend: number; overValue: number; }[], checkBin: { bin: number; message: string; }[]) {
        // let error: any = getAtomValue(this.atomError);
        let error: { [id: number]: { pend: number; overValue: number; } | { bin: number; message: string; } } = {};
        for (let row of checkPend) {
            error[row.pend] = row;
        }
        for (let row of checkBin) {
            error[row.bin] = row;
        }
        setAtomValue(this.atomError, error);
    }

    async onDiscard() {
        await this.storeSheet.discard();
        this.closeModal(EnumSheetEditReturn.discard);
        // console.discard(this.mainStore.valRow.id);
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


    notifyRowChange() {
        this.controlSheetDash.notifyRowChange(this.storeSheet);
    }

}
