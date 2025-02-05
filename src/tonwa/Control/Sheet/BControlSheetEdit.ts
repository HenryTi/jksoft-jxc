import { atom } from "jotai";
import { ControlBiz } from "..";
import { BinRow, EntityBin, EntitySheet } from "../../Biz";
import { getAtomValue, setAtomValue } from "../../tools";
import { BControlSheet, EnumSheetEditReturn, SubmitState } from "./BControlSheet";
// import { ViewSubmitReaction } from "./ViewSubmitReaction";
import { BControlDetailEdit } from "./BControlDetailEdit";
import { BControlSheetDash } from "./BControlSheetDash";
import { JSX } from "react";

export abstract class BControlSheetEdit extends BControlSheet {
    protected readonly controlSheetDash: BControlSheetDash;
    readonly controlDetailEdit: BControlDetailEdit;
    readonly atomReaction = atom(undefined as any);
    readonly atomError = atom(undefined as { [id: number]: { pend: number; overValue: number; } | { bin: number; message: string; } });
    readonly atomSum = atom(get => {
        return this.binStore.sum(get);
    });
    constructor(controlSheetDash: BControlSheetDash) {
        const { controlBiz: controllerBiz, entity: entitySheet } = controlSheetDash;
        super(controllerBiz, entitySheet);
        this.controlDetailEdit = this.createControlDetailEdit();
        // new ControlDetailEdit(this, this.binStore.entity);
    }

    protected abstract createControlDetailEdit(): BControlDetailEdit;

    atomSubmitState = atom((get) => {
        if (this.binStore === undefined) return SubmitState.enable;
        return get(this.binStore.atomSubmitState);
    }, null);

    private checkTrigger() {
        console.error('if (mainStore.trigger() === false) return false;');
        // if (mainStore.trigger() === false) return false;
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
        // await sheetConsole.onSubmited(store);
        // 转到 ControllerSheetDash中操作
        // const { mainStore: main } = store;
        this.modal.close(EnumSheetEditReturn.submit);
    }

    protected abstract ViewSubmitReaction(): JSX.Element;
    /* {
        return <ViewSubmitReaction />;
    } */

    private setSubmitError(checkPend: { pend: number; overValue: number; }[], checkBin: { bin: number; message: string; }[]) {
        let error: any = getAtomValue(this.atomError);
        if (error === undefined) error = {};
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
}
