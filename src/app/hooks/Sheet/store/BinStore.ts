import { PendRow, SheetStore } from "./SheetStore";
import { BinDiv, EntityBin, PickPend } from "app/Biz";
import { Getter, WritableAtom, atom } from "jotai";
import { getValRowPropArr, ValRow } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { ValDiv, ValDivBase, ValDivRoot, ValDivs, ValDivsBase, ValDivsRoot } from './ValDiv';
import { BudEditing, ValuesBudsEditing, ValueSpace } from "app/hooks";
import { PickPendStore } from "./PickPendStore";
import { EntityStore } from "app/tool";
import { ParamSaveDetail } from "uqs/UqDefault";

enum PendLoadState {
    none,
    loading,
    loaded,
}
export enum SubmitState {
    none,
    // hide,
    disable,
    enable,
}
export class BinStore extends EntityStore<EntityBin> {
    private valDivColl: { [id: number]: ValDivBase };
    private pendLoadState: PendLoadState;
    readonly atomWaiting = atom(false);
    readonly sheetStore: SheetStore;
    readonly binDivRoot: BinDiv;
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> };
    readonly atomPendRows = atom(undefined as PendRow[]);
    readonly valDivsRoot: ValDivsRoot;
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;
    readonly budEditings: BudEditing[];
    readonly pickPendStores: { [id: number]: PickPendStore; } = {};

    constructor(sheetStore: SheetStore, entityBin: EntityBin) {
        const { modal, biz } = sheetStore;
        super(modal, entityBin);
        this.sheetStore = sheetStore;
        const { pend, binDivRoot } = entityBin;
        this.binDivRoot = binDivRoot;
        this.valDivsOnPend = sheetStore.valDivsOnPend;
        this.valDivsRoot = new ValDivsRoot();
        this.valDivColl = {};
        this.pendLoadState = PendLoadState.none;
        this.atomSubmitState = atom((get) => {
            const valDivs = get(this.valDivsRoot.getAtomValDivs());
            let hasValue = false;
            if (valDivs.length === 0) return SubmitState.none;
            for (let valDiv of valDivs) {
                const { atomValue, atomSum } = valDiv;
                let value = get(atomValue);
                let { sumValue } = get(atomSum);
                let valRow = get(valDiv.getAtomValRow());
                if (valRow.id < 0) return SubmitState.disable;
                if (value !== undefined || sumValue > 0) hasValue = true;
                const { pendValue } = valRow;
                // if (pendValue === undefined) debugger;
                if (value > pendValue || sumValue > pendValue) return SubmitState.disable;
            }
            let ret = hasValue === true ? SubmitState.enable : SubmitState.disable; // .hide;
            return ret;
        }, null);
        if (pend !== undefined) {
            const valuesBudsEditing = new ValuesBudsEditing(modal, biz, pend.params);
            this.budEditings = valuesBudsEditing.createBudEditings();
        }
    }

    setWaiting(waiting: boolean) {
        setAtomValue(this.atomWaiting, waiting);
    }

    async loadPend(params: any): Promise<void> {
        if (this.pendLoadState !== PendLoadState.none) return;
        this.pendLoadState = PendLoadState.loading;

        let pendRows = await this.sheetStore.loadPend(params, undefined);
        this.pendLoadState = PendLoadState.loaded;
        const { valDivs } = this.valDivsRoot;
        if (valDivs !== undefined) {
            for (let valDiv of valDivs) {
                let { valRow } = valDiv;
                this.setPend(valRow.pend, valDiv, false);
            }
        }
        setAtomValue(this.atomPendRows, pendRows);
    }

    async searchPend(params: any): Promise<void> {
        this.pendLoadState = PendLoadState.none;
        await this.loadPend(params);
    }

    setReload() {
        this.pendLoadState = PendLoadState.none;
    }

    async loadPendId(pendId: number): Promise<void> {
        const retPendRows = await this.sheetStore.loadPend({}, pendId);
        let pendRows = getAtomValue(this.atomPendRows);
        if (pendRows === undefined) {
            pendRows = retPendRows;
        }
        else {
            pendRows.push(...retPendRows);
        }
        setAtomValue(this.atomPendRows, pendRows);
    }

    load(valRows: ValRow[], trigger: boolean) {
        let valDivs = [];
        for (let valRow of valRows) {
            let valDiv = this.setValRowRoot(valRow, trigger);
            if (valDiv !== undefined) valDivs.push(valDiv);
        }
        this.valDivsRoot.setValDivs(valDivs);
    }

    getPendLeft(valDiv: ValDivBase): number {
        if (valDiv === undefined) return undefined;
        function has(valDivs: ValDivs, valDiv: ValDivBase) {
            let vds = valDivs.valDivs;
            for (let vd of vds) {
                if (vd === valDiv) return true;
                if (has(vd, valDiv) === true) return true;
            }
            return false;
        }
        let vds = this.valDivsRoot.valDivs;
        let pendRows = getAtomValue(this.atomPendRows);
        for (let vd of vds) {
            if (has(vd, valDiv) === true) {
                let { valRow, atomSum } = vd;
                let { sumValue, sumAmount } = getAtomValue(atomSum);
                let { pend } = valRow;
                let pendRow = pendRows?.find(v => v.pend === pend);
                if (pendRow === undefined) {
                    // debugger;
                    return undefined;
                }
                return pendRow.value - sumValue;
            }
        }
        return undefined;
    }

    async delValDiv(valDiv: ValDivBase) {
        const ids: number[] = [];
        let valDivToDel = this.getNeedDelValDiv(valDiv);
        const { binDiv, valRow } = valDivToDel;
        if (binDiv.subBinDiv === undefined) {
            const { id } = valRow;
            this.delValRow(id);
            ids.push(id);
        }
        else {
            this.delValDivAndSubs(ids, valDiv);
        }
        // debugger;
        await this.delDetail(ids);
        this.sheetStore.notifyRowChange();
    }

    private getNeedDelValDiv(valDiv: ValDivBase): ValDivBase {
        const { parent } = valDiv;
        if (parent !== undefined && parent.valDivs.length === 1) {
            return this.getNeedDelValDiv(parent);
        }
        return valDiv;
    }

    private delValDivAndSubs(ids: number[], valDiv: ValDivBase) {
        for (; ;) {
            const { valDivs } = valDiv;
            const { length } = valDivs;
            if (length === 0) break;
            let valDivSub = valDivs[length - 1];
            this.delValDivAndSubs(ids, valDivSub);
        }
        let { id } = valDiv;
        this.delValRow(id);
        ids.push(id);
    }

    private getOwnerAtomValDivs(valRow: ValRow): ValDivsBase<any> {
        const { subBinDiv: div } = this.binDivRoot;
        if (div === undefined) {
            return this.valDivsRoot;
        }
        const { origin } = valRow;
        let valDiv = this.valDivColl[origin];
        return valDiv ?? this.valDivsRoot;
    }

    private delValRow(id: number) {
        let val = this.valDivColl[id];
        let { valRow } = val;
        const { origin } = valRow;
        let valDiv = this.valDivColl[origin];
        if (valDiv === undefined) {
            // top div
            const { pend } = valRow;
            let _valDiv = this.valDivsOnPend[pend];
            setAtomValue(_valDiv, undefined);
        }
        // await this.delDetail([id]);
        let valDivs = this.getOwnerAtomValDivs(valRow);
        valDivs.delValRow(id);
    }

    private async delDetail(ids: number[]) {
        await this.uq.DeleteBin.submit({ ids });
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
        let rootValDiv: ValDivBase;
        let valDiv: ValDivBase;
        let { origin } = valRow;
        if (origin !== undefined) {
            let valDivOrigin = this.valDivColl[origin];
            if (valDivOrigin === undefined) {
                rootValDiv = valDiv = this.addRootDiv(valRow, trigger);
            }
            else {
                if (valDivOrigin.binDiv.subBinDiv === undefined) {
                    debugger;
                    return;
                }
                valDiv = this.setVal(valDivOrigin, valRow, trigger);
            }
        }
        else {
            rootValDiv = valDiv = this.addRootDiv(valRow, trigger);
        }
        let { binDiv } = valDiv;
        let { binDivBuds: { budIBase, budXBase } } = binDiv;
        if (budIBase !== undefined) {
            let bizAtom = this.sheetStore.bizAtomColl[budIBase.id]?.atom;
            if (bizAtom !== undefined) valDiv.iBase = bizAtom.id;
        }
        if (budXBase !== undefined) {
            let bizAtom = this.sheetStore.bizAtomColl[budXBase.id]?.atom;
            if (bizAtom !== undefined) valDiv.xBase = bizAtom.id;
        }
        return rootValDiv;
    }

    private setVal(parentValDiv: ValDivBase, valRow: ValRow, trigger: boolean): ValDivBase {
        let { id } = valRow;
        let valDiv = this.valDivColl[id];
        if (valDiv !== undefined) {
            valDiv.setValRow(valRow);
            return valDiv;
        }
        let valDivSub = new ValDiv(parentValDiv, valRow);
        this.valDivColl[id] = valDivSub;
        parentValDiv.addValDiv(valDivSub, trigger);
        return valDivSub;
    }

    async loadPendRow(pend: number) {
        let ret = this.sheetStore.getPendRow(pend);
        if (ret === undefined) {
            await this.loadPendId(pend);
            ret = this.sheetStore.getPendRow(pend);
        }
        return ret;
    }

    async saveDetail(binDiv: BinDiv, valRow: ValRow) {
        const { buds } = binDiv;
        let { id, i, x, value, price, amount, pend, origin } = valRow;
        let propArr = getValRowPropArr(valRow, buds);
        let param: ParamSaveDetail = {
            base: this.sheetStore.mainId,
            phrase: binDiv.entityBin.id,
            id,
            i,
            x,
            value,
            price,
            amount,
            origin,
            pend,
            props: propArr,
        };
        let retSaveDetail = await this.uq.SaveDetail.submitReturns(param);
        id = retSaveDetail.ret[0].id;
        return id;
    }

    async reloadBinProps(bin: number) {
        await this.sheetStore.reloadBinProps(bin);
    }

    async reloadValRow(valRow: ValRow) {
        const { id: binId } = valRow;
        let { details } = await this.sheetStore.loadBinData(binId);
        // 这里不应该再调用下面的load
        // reload其实是load相关props和atoms
        // this.load(details, true);
    }

    replaceValDiv(valDiv: ValDivBase, newValDiv: ValDivRoot) {
        const { valDivs } = this.valDivsRoot;
        let { length } = valDivs;
        for (let i = 0; i < length; i++) {
            if (valDiv === valDivs[i]) {
                valDivs.splice(i, 1, newValDiv);
                this.valDivsRoot.setValDivs([...valDivs]);
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
        const { valDivs } = this.valDivsRoot;
        for (let vd of valDivs) {
            let ret = this.getParentDivInternal(vd, valDiv);
            if (ret !== undefined) return ret;
        }
        return undefined;
    }

    private getParentDivInternal(valDivParent: ValDivBase, valDiv: ValDivBase): ValDivBase {
        const { valDivs } = valDivParent;
        for (let vd of valDivs) {
            if (vd === valDiv) return valDivParent;
            let ret = this.getParentDivInternal(vd, valDiv);
            if (ret !== undefined) return ret;
        }
        return undefined;
    }

    getPickPendStore(pickPend: PickPend, valueSpace: ValueSpace) {
        let { id } = pickPend;
        let pps = this.pickPendStores[id];
        if (pps === undefined) {
            this.pickPendStores[id] = pps = new PickPendStore(this, pickPend, valueSpace);
        }
        return pps;
    }

    sum(get: Getter) {
        let sumAmount: number = 0, sumValue: number = 0;
        const { valDivs } = this.valDivsRoot;
        for (let valDiv of valDivs) {
            const { sumValue: v0, sumAmount: a0 } = get(valDiv.atomSum);
            sumValue += v0;
            sumAmount += a0;
        }
        return { sumAmount, sumValue };
    }
}
