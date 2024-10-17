import { PendRow, SheetStore } from "./SheetStore";
import { BinDiv, EntityBin, EnumDetailOperate, PickPend } from "app/Biz";
import { Getter, WritableAtom, atom } from "jotai";
import { getValRowPropArr, PendProxyHandler, ValRow } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { ValDiv, ValDivBase, ValDivRoot, ValDivs, ValDivsBase, ValDivsRoot } from './ValDiv';
import { BudEditing, ValuesBudsEditing, ValueSpace } from "app/hooks";
import { PickPendStore } from "./PickPendStore";
import { EntityStore } from "app/tool";
import { ParamSaveDetails } from "uqs/UqDefault";
import { DivEditing } from "./BinEditing";

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
export class BinStore extends EntityStore<EntityBin> {
    private valDivColl: { [id: number]: ValDivBase };
    private pendLoadState: PendLoadState;
    readonly atomWaiting = atom(false);
    readonly sheetStore: SheetStore;
    readonly operate: EnumDetailOperate;
    readonly binDivRoot: BinDiv;
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> };
    readonly atomPendRows = atom(undefined as PendRow[]);
    readonly valDivsRoot: ValDivsRoot;
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;
    readonly budEditings: BudEditing[];
    readonly pickPendStores: { [id: number]: PickPendStore; } = {};

    constructor(sheetStore: SheetStore, entityBin: EntityBin, operate: EnumDetailOperate) {
        const { modal, biz } = sheetStore;
        super(modal, entityBin);
        this.sheetStore = sheetStore;
        this.operate = operate;
        const { pend, binDivRoot } = entityBin;
        this.binDivRoot = binDivRoot;
        this.valDivsOnPend = sheetStore.valDivsOnPend;
        this.valDivsRoot = new ValDivsRoot();
        this.valDivColl = {};
        this.pendLoadState = PendLoadState.none;
        this.atomSubmitState = atom((get) => {
            const valDivs = get(this.valDivsRoot.atomValDivs);
            let hasValue = false;
            if (valDivs.length === 0) return SubmitState.none;
            for (let valDiv of valDivs) {
                const { atomValue, atomSum, atomDeleted } = valDiv;
                const deleted = get(atomDeleted);
                if (deleted === true) continue;
                let value = get(atomValue);
                let { sumValue } = get(atomSum);
                let valRow = get(valDiv.getAtomValRow());
                if (valRow.id < 0) return SubmitState.disable;
                if (value !== undefined || sumValue > 0) hasValue = true;
                const { pendValue } = valRow;
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

    async deleteAllRemoved() {
        let ids: number[] = [];
        for (let valDiv of this.valDivsRoot.valDivs) {
            this.deletedIds(ids, valDiv);
        }
        if (ids.length > 0) {
            await this.delDetail(ids);
        }
    }

    async delValDiv(valDiv: ValDivBase) {
        const ids: number[] = [];
        this.emptyIds(ids, valDiv);
        // debugger;
        await this.delDetail(ids);
        this.sheetStore.notifyRowChange();
    }

    private deletedIds(ids: number[], valDiv: ValDivBase) {
        if (getAtomValue(valDiv.atomDeleted) === true) {
            ids.push(valDiv.id);
            this.subIds(ids, valDiv);
            return;
        }
        for (let sub of valDiv.valDivs) {
            this.deletedIds(ids, sub);
        }
    }

    private subIds(ids: number[], valDiv: ValDivBase) {
        for (let sub of valDiv.valDivs) {
            ids.push(sub.id);
            this.subIds(ids, sub);
        }
    }

    private emptyIds(ids: number[], valDiv: ValDivBase) {
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

    private setValRowRoot(valRow: ValRow, trigger: boolean) {
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

    async saveDetailsDirect() {
        const { binDivRoot } = this.entity;
        const { valDivs } = this.valDivsRoot;
        if (valDivs.length === 0) return;
        let valRows = valDivs.map(v => v.valRow);
        await this.saveDetails(binDivRoot, valRows);
    }

    async saveDetails(binDiv: BinDiv, valRows: ValRow[]) {
        const { buds } = binDiv;
        let details = [];
        for (let valRow of valRows) {
            let { id, i, x, value, price, amount, pend, origin } = valRow;
            let propArr = getValRowPropArr(valRow, buds);
            details.push({
                id,
                i,
                x,
                value,
                price,
                amount,
                origin,
                pend,
                props: propArr,
            });
        }
        let param: ParamSaveDetails = {
            base: this.sheetStore.mainId,
            phrase: binDiv.entityBin.id,
            details,
        };
        let { details: retDetails, props, specs, atoms } = await this.uq.SaveDetails.submitReturns(param);
        if (retDetails.length === 0) {
            console.error('*************** SaveDetails something wrong *******************');
            return;
        }
        this.sheetStore.cacheIdAndBuds(props, atoms, specs);
        let { length } = valRows;
        for (let i = 0; i < length; i++) {
            let retDetail = retDetails[i];
            let { id } = retDetail;
            let valRow = valRows[i];
            valRow.id = id;
            this.setValRowRoot(valRow, true);
        }
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
        const { atomValDivs } = this.valDivsRoot;
        const valDivs = get(atomValDivs);
        for (let valDiv of valDivs) {
            const { sumValue: v0, sumAmount: a0 } = get(valDiv.atomSum);
            sumValue += v0;
            sumAmount += a0;
        }
        return { sumAmount, sumValue };
    }

    addNewPendRow(pendId: number) {
        let atomValDiv = this.valDivsOnPend[pendId];
        let valRow: ValRow = { id: -pendId, buds: {}, owned: {}, pend: pendId };
        let retValDiv = new ValDivRoot(this.binDivRoot, valRow);
        this.valDivsRoot.addValDiv(retValDiv, true);
        setAtomValue(atomValDiv, retValDiv);
        return retValDiv;
    }

    addAllPendRows() {
        let pendRows = getAtomValue(this.atomPendRows);
        for (let pendRow of pendRows) {
            this.addNewPendRow(pendRow.pend);
        }
    }

    async addAllPendRowsDirect() {
        let pendRows = getAtomValue(this.atomPendRows);
        const { pend, binDivRoot } = this.entity;
        const valRows: ValRow[] = [];
        for (let pendRow of pendRows) {
            let { pend: pendId } = pendRow;
            let pendResult = new Proxy(pendRow, new PendProxyHandler(pend));
            let valRow: ValRow = { id: undefined, buds: {}, owned: {}, pend: pendId };
            let valDiv = new ValDivRoot(this.binDivRoot, valRow);
            this.valDivsRoot.addValDiv(valDiv, true);
            let divEditing = new DivEditing(this, valDiv);
            divEditing.setNamedValues('pend', pendResult);
            divEditing.setNamedValues('%pend', pendResult);
            divEditing.calcAll();
            valDiv.mergeValRow(divEditing.values);
            valRows.push(valDiv.valRow);
            // let { valRow } = valDiv;
            // valDiv.setValRow(valRow);
            // valDiv.setIXBaseFromInput(divEditing);
        }
    }

    deletePendThoroughly(valRow: ValRow) {
        const { id } = valRow;
        let pendId = -id;
        let atomValDiv = this.valDivsOnPend[pendId];
        this.valDivsRoot.removePend(pendId);
        setAtomValue(atomValDiv, undefined);
    }
}
