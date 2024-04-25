import { PendRow, SheetStore } from "./SheetStore";
import { BinDiv, EntityBin } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { budValuesFromProps } from "../../tool";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { ValRow, arrFromJsonMid } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { NamedResults } from "./NamedResults";
import { ValDiv, ValDivBase, ValDivRoot, ValDivs, ValDivsRoot } from './ValDiv';

enum PendLoadState {
    none,
    loading,
    loaded,
}
export enum SubmitState {
    none,
    hide,
    disable,
    enable,
}
export class DivStore {
    private valDivColl: { [id: number]: ValDivBase };
    private pendLoadState: PendLoadState;
    readonly sheetStore: SheetStore;
    readonly entityBin: EntityBin;
    readonly binDivRoot: BinDiv;
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> };
    pendRows: PendRow[];
    readonly valDivsRoot: ValDivsRoot;
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;

    constructor(sheetStore: SheetStore, entityBin: EntityBin) {
        this.sheetStore = sheetStore;
        this.entityBin = entityBin;
        this.binDivRoot = entityBin.binDivRoot;
        this.valDivsOnPend = sheetStore.valDivsOnPend;
        this.valDivsRoot = new ValDivsRoot(); // entityBin.div, undefined);
        this.valDivColl = {};
        this.pendLoadState = PendLoadState.none;
        this.atomSubmitState = atom((get) => {
            const { atomValDivs } = this.valDivsRoot;
            if (atomValDivs === undefined) return SubmitState.none;
            let valDivs = get(atomValDivs);
            let hasValue = false;
            if (valDivs.length === 0) return SubmitState.none;
            for (let valDiv of valDivs) {
                const { atomValue, atomValRow } = valDiv;
                let value = get(atomValue);
                let valRow = get(atomValRow);
                if (valRow.id < 0) return SubmitState.disable;
                if (value !== undefined) hasValue = true;
                if (value > valRow.pendValue) return SubmitState.disable;
            }
            return hasValue === true ? SubmitState.enable : SubmitState.hide;
        }, null);
    }

    async loadPend(params: any): Promise<void> {
        if (this.pendLoadState !== PendLoadState.none) return;
        this.pendLoadState = PendLoadState.loading;
        this.pendRows = await this.sheetStore.loadPend(params, undefined);
        this.pendLoadState = PendLoadState.loaded;
        const { atomValDivs } = this.valDivsRoot;
        if (atomValDivs !== undefined) {
            let valDivs = getAtomValue(atomValDivs);
            for (let valDiv of valDivs) {
                let valRow = getAtomValue(valDiv.atomValRow);
                this.setPend(valRow.pend, valDiv, false);
            }
        }
    }

    setReload() {
        this.pendLoadState = PendLoadState.none;
    }

    async loadPendId(pendId: number): Promise<void> {
        const pendRows = await this.sheetStore.loadPend({}, pendId);
        if (this.pendRows === undefined) {
            this.pendRows = pendRows;
        }
        else {
            this.pendRows.push(...pendRows);
        }
    }

    load(valRows: ValRow[]) {
        const trigger = false;
        for (let valRow of valRows) {
            this.setValRowRoot(valRow, trigger);
        }
    }

    getPendLeft(valDiv: ValDivBase): number {
        if (valDiv === undefined) return undefined;
        function has(valDivs: ValDivs, valDiv: ValDivBase) {
            let vds = getAtomValue(valDivs.atomValDivs);
            for (let vd of vds) {
                if (vd === valDiv) return true;
                if (has(vd, valDiv) === true) return true;
            }
            return false;
        }
        let vds = getAtomValue(this.valDivsRoot.atomValDivs);
        for (let vd of vds) {
            if (has(vd, valDiv) === true) {
                let { atomValRow, atomSum: atomValue } = vd;
                let value = getAtomValue(atomValue);
                let valRow = getAtomValue(atomValRow);
                let { pend } = valRow;
                let pendRow = this.pendRows?.find(v => v.pend === pend);
                if (pendRow === undefined) {
                    // debugger;
                    return undefined;
                }
                return pendRow.value - value;
            }
        }
        return undefined;
    }

    async delValDiv(valDiv: ValDivBase) {
        const { binDiv, atomValRow } = valDiv;
        if (binDiv.subBinDiv === undefined) {
            let valRow = getAtomValue(atomValRow);
            await this.delValRow(valRow.id);
            this.sheetStore.notifyRowChange();
            return;
        }
        alert('彻底删除单据分拆行正在实现中...');
    }

    private getOwnerAtomValDivs(valRow: ValRow) {
        const { subBinDiv: div } = this.binDivRoot;
        if (div === undefined) {
            return this.valDivsRoot; // .atomValDivs;
        }
        const { origin } = valRow;
        let valDiv = this.valDivColl[origin];
        return valDiv; // .atomValDivs;
    }

    async delValRow(id: number) {
        let val = this.valDivColl[id];
        let valRow = getAtomValue(val.atomValRow);
        const { origin } = valRow;
        let valDiv = this.valDivColl[origin];
        if (valDiv === undefined) {
            // top div
            const { pend } = valRow;
            let _valDiv = this.valDivsOnPend[pend];
            setAtomValue(_valDiv, undefined);
        }
        await this.sheetStore.delDetail(id);
        let atomValDivs = this.getOwnerAtomValDivs(valRow);
        atomValDivs.delValRow(id);
        /*
        let divs = getAtomValue(atomValDivs);
        let p = divs.findIndex(v => v.id === id);
        if (p >= 0) {
            divs.splice(p, 1);
            setAtomValue(atomValDivs, [...divs]);
        }
        */
    }

    setValRow(parentValDiv: ValDiv, valRow: ValRow) {
        this.setValRowInternal(parentValDiv, valRow, true);
    }

    private setValRowInternal(parentValDiv: ValDiv, valRow: ValRow, trigger: boolean) {
        if (parentValDiv === undefined) debugger;
        const { pend } = valRow;
        let val = this.setVal(parentValDiv, valRow, trigger);
        // this.setPend(pend, val);
    }

    private setPend(pend: number, val: ValDivRoot, trigger: boolean) {
        if (pend === undefined) return;
        let valAtom = this.valDivsOnPend[pend];
        if (valAtom === undefined || trigger !== true) {
            this.valDivsOnPend[pend] = atom(val);
        }
        else {
            setAtomValue(valAtom, val);
        }
    }

    private addRootDiv(valRow: ValRow, trigger: boolean) {
        let { id } = valRow;
        let valDiv = this.valDivColl[id] as ValDivRoot;
        if (valDiv !== undefined) {
            valDiv.setValRow(valRow);
            return valDiv;
        }
        valDiv = new ValDivRoot(this.binDivRoot, valRow);
        this.valDivColl[id] = valDiv;
        this.valDivsRoot.addValDiv(valDiv, trigger);
        const { pend } = valRow;
        this.setPend(pend, valDiv, trigger);
        return valDiv;
    }

    setValRowRoot(valRow: ValRow, trigger: boolean) {
        let { origin } = valRow;
        if (origin !== undefined) {
            let valDivOrigin = this.valDivColl[origin];
            if (valDivOrigin === undefined) {
                this.addRootDiv(valRow, trigger);
            }
            else {
                this.setVal(valDivOrigin, valRow, trigger);
            }
        }
        else {
            this.addRootDiv(valRow, trigger);
        }

        /*
        let parentValDivs: ValDivs;
        if (origin === undefined || origin < 0) {
            parentValDivs = this.rootValDiv;
        }
        else {
            let parentValDiv = this.valDivColl[origin];
            if (parentValDiv === undefined) {
                parentValDivs = this.rootValDiv;
            }
            else {
                // 获取层级值
                let level = 0;
                for (let p = parentValDiv; p !== undefined; level++) {
                    const { origin: pOrigin } = getAtomValue(p.atomValRow);
                    p = this.valDivColl[pOrigin];
                }
                for (let i = 0; i < level; i++) {
                    binDiv = binDiv.subBinDiv;
                }
                if (binDiv === undefined) debugger;
                parentValDivs = parentValDiv;
                parentValDiv.setIXBase(this.sheetStore, valRow);
            }
        }
        let valDivSub = new ValDiv(parentValDiv, valRow); // this.setSub(parentValDiv, valRow);
        this.valDivColl[id] = valDivSub;
        const { atomValDivs } = parentValDiv ?? this.rootValDiv; //valDivs;
        let divs = getAtomValue(atomValDivs);
        divs.push(valDivSub);
        if (trigger === true) {
            setAtomValue(atomValDivs, [...divs]);
        }
        return valDivSub;
        */
    }

    private setVal(parentValDiv: ValDivBase, valRow: ValRow, trigger: boolean): ValDivBase {
        let { id/*, origin*/ } = valRow;
        let valDiv = this.valDivColl[id];
        if (valDiv !== undefined) {
            valDiv.setValRow(valRow);
            return valDiv;
        }
        // let binDiv = this.binDiv;
        /*
        let { subBinDiv: subBinDiv } = binDiv;
        if (subBinDiv === undefined) {
            valDiv = new ValDiv(parentValDiv, valRow);
            this.valDivColl[id] = valDiv;
            this.rootValDiv.addValDiv(valDiv, trigger);
            const { pend } = valRow;
            if (pend !== undefined) {
                this.pendColl[pend] = atom(valDiv);
            }
            return valDiv;
        }
        let parentValDivs: ValDivs;
        if (origin === undefined || origin < 0) {
            parentValDivs = this.rootValDiv;
        }
        else {
            let parentValDiv = this.valDivColl[origin];
            if (parentValDiv === undefined) {
                parentValDivs = this.rootValDiv;
            }
            else {
                // 获取层级值
                let level = 0;
                for (let p = parentValDiv; p !== undefined; level++) {
                    const { origin: pOrigin } = getAtomValue(p.atomValRow);
                    p = this.valDivColl[pOrigin];
                }
                for (let i = 0; i < level; i++) {
                    binDiv = binDiv.subBinDiv;
                }
                if (binDiv === undefined) debugger;
                parentValDivs = parentValDiv;
                parentValDiv.setIXBase(this.sheetStore, valRow);
            }
        }
        */
        for (let p = parentValDiv; p !== undefined; p = p.parent) {
            p.setIXBase(this.sheetStore, valRow);
        }
        let valDivSub = new ValDiv(parentValDiv, valRow); // this.setSub(parentValDiv, valRow);
        this.valDivColl[id] = valDivSub;
        parentValDiv.addValDiv(valDivSub, trigger);
        /*
        const { atomValDivs } = parentValDiv ?? this.rootValDiv; //valDivs;
        let divs = getAtomValue(atomValDivs);
        divs.push(valDivSub);
        if (trigger === true) {
            setAtomValue(atomValDivs, [...divs]);
        }
        */
        return valDivSub;
    }
    /*
    private setSub(parentValDiv: ValDiv, valRow: ValRow) {
        let { id } = valRow;
        let subVal = 
        this.valDivColl[id] = subVal;
        return subVal;
    }
    */
    setValColl(valDiv: ValDivBase) {
        this.valDivColl[valDiv.id] = valDiv;
    }

    getPendRow(pend: number) {
        let ret = this.pendRows?.find(v => v.pend === pend);
        return ret;
    }

    async loadPendRow(pend: number) {
        let ret = this.getPendRow(pend);
        if (ret === undefined) {
            await this.loadPendId(pend);
            ret = this.getPendRow(pend);
        }
        return ret;
    }

    async saveDetail(binDiv: BinDiv, valRow: ValRow) {
        const { buds } = binDiv;
        let retId = await this.sheetStore.saveDetail(binDiv.entityBin, buds, valRow);
        return retId;
    }

    async reloadBinProps(bin: number) {
        await this.sheetStore.reloadBinProps(bin);
    }

    replaceValDiv(valDiv: ValDivBase, newValDiv: ValDivRoot) {
        const { atomValDivs } = this.valDivsRoot;
        let valDivs = getAtomValue(atomValDivs);
        let { length } = valDivs;
        for (let i = 0; i < length; i++) {
            if (valDiv === valDivs[i]) {
                valDivs.splice(i, 1, newValDiv);
                setAtomValue(atomValDivs, [...valDivs]);
                break;
            }
        }
        let pend = valDiv.pend;
        let atomValDiv = this.valDivsOnPend[pend];
        setAtomValue(atomValDiv, newValDiv);
    }

    removePend(pendId: number) {
        this.valDivsRoot.removePend(pendId);
        setAtomValue(this.valDivsOnPend[pendId], undefined);
    }

    trigger(): boolean {
        // 检查div是不是有值
        return true;
    }

    getParentValDiv(valDiv: ValDivBase): ValDivBase {
        const { atomValDivs } = this.valDivsRoot;
        let valDivs = getAtomValue(atomValDivs);
        for (let vd of valDivs) {
            let ret = this.getParentDivInternal(vd, valDiv);
            if (ret !== undefined) return ret;
        }
        return undefined;
    }

    private getParentDivInternal(valDivParent: ValDivBase, valDiv: ValDivBase): ValDivBase {
        const { atomValDivs } = valDivParent;
        let valDivs = getAtomValue(atomValDivs);
        for (let vd of valDivs) {
            if (vd === valDiv) return valDivParent;
            let ret = this.getParentDivInternal(vd, valDiv);
            if (ret !== undefined) return ret;
        }
        return undefined;
    }
}
