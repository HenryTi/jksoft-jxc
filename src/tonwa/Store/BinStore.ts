import { Getter, WritableAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { getValRowPropArr, PendProxyHandler, ValRow } from "./ValRow";
import { BinDiv, BizBud, EntityBin, EnumDetailOperate, PickPend } from "../Biz";
import { ValDiv, ValDivBase, ValDivRoot, ValDivs, ValDivsBase, ValDivsRoot } from './ValDiv';
import { PickPendStore } from "./PickPendStore";
import { PendRow, StoreSheet } from "./StoreSheet";
import { StoreEntity } from "./Store";
// import { DivEditing } from "./BinEditing";

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
export class BinStore extends StoreEntity<EntityBin> {
    private valDivColl: { [id: number]: ValDivBase };
    private pendLoadState: PendLoadState;
    readonly atomWaiting = atom(false);
    readonly sheetStore: StoreSheet;
    readonly operate: EnumDetailOperate;
    readonly binDivRoot: BinDiv;
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> };
    readonly atomPendRows = atom(undefined as PendRow[]);
    readonly valDivsRoot: ValDivsRoot;
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;
    // readonly budEditings: BudEditing[];
    readonly pickPendStores: { [id: number]: PickPendStore; } = {};
    queryRowColl: { [id: number]: boolean } = {}

    constructor(storeSheet: StoreSheet, entityBin: EntityBin, operate: EnumDetailOperate) {
        const { modal, biz } = storeSheet;
        super(modal, entityBin);
        this.sheetStore = storeSheet;
        this.operate = operate;
        const { pend, binDivRoot } = entityBin;
        this.binDivRoot = binDivRoot;
        this.valDivsOnPend = storeSheet.valDivsOnPend;
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
        /*
        if (pend !== undefined) {
            const valuesBudsEditing = new ValuesBudsEditing(modal, biz, pend.params);
            this.budEditings = valuesBudsEditing.createBudEditings();
        }
        */
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
        await this.delDetail(ids);
    }

    async delValDiv(valDiv: ValDivBase) {
        const ids: number[] = [];
        this.emptyIds(ids, valDiv);
        // debugger;
        await this.delDetail(ids);
        // this.sheetStore.notifyRowChange();
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

    async deleteValRows(valRows: ValRow[]) {
        let ids = valRows.map(v => v.id);
        await this.delDetail(ids);
    }

    private async delDetail(ids: number[]) {
        if (ids.length === 0) return;
        //await this.uq.DeleteBin.submit({ ids });
        await this.client.DeleteBin(ids);
        this.setPickBound();
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
        let { id, pend } = valRow;
        let valDiv = this.valDivColl[id] as ValDivRoot;
        if (valDiv !== undefined) {
            valDiv.setValRow(valRow);
            return valDiv;
        }
        valDiv = new ValDivRoot(this.binDivRoot, valRow);
        this.valDivColl[id] = valDiv;
        this.valDivsRoot.addValDiv(valDiv, trigger);
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
            let bizAtom = this.sheetStore.getCacheAtom(budIBase.id)?.atom;
            if (bizAtom !== undefined) valDiv.iBase = bizAtom.id;
        }
        if (budXBase !== undefined) {
            let bizAtom = this.sheetStore.getCacheAtom(budXBase.id)?.atom;
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
        this.setValRowArrayToRoot(valRows);
    }

    async saveDetails(binDiv: BinDiv, valRows: ValRow[]) {
        const { buds } = binDiv;
        let inDetails: InDetail[] = [];
        for (let valRow of valRows) {
            let { id, i, x, value, price, amount, pend, origin } = valRow;
            let propArr = getValRowPropArr(valRow, buds);
            inDetails.push({
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
        let results = await this.uqSaveDetails(binDiv.entityBin.id, inDetails);
        if (results === undefined) return;
        let { details: retDetails, props, forks, atoms } = results;
        this.sheetStore.cacheIdAndBuds(props, atoms, forks);
        let { length } = valRows;
        for (let i = 0; i < length; i++) {
            let retDetail = retDetails[i];
            let { id } = retDetail;
            let valRow = valRows[i];
            valRow.id = id;
        }
        this.setPickBound();
    }

    private setPickBound() {
        const { pickBound } = this.entity;
        if (pickBound === undefined) return;
        this.queryRowColl = {};
        let boundBud = pickBound[1];
        for (let i in this.valDivColl) {
            let { valRow, atomDeleted } = this.valDivColl[i];
            let deleted = getAtomValue(atomDeleted);
            if (deleted === true) continue;
            this.setQueryBound(valRow, boundBud);
        }
    }

    hasPickBound(valRow: ValRow) {
        const { pickBound } = this.entity;
        if (pickBound === undefined) return false;
        let boundBud = pickBound[1];
        let v = this.getDetailBudValue(valRow, boundBud);
        return this.queryRowColl[v as number] === true;
    }

    private getDetailBudValue(valRow: ValRow, bud: BizBud) {
        if (bud === this.entity.i) return valRow.i;
        if (bud === this.entity.x) return valRow.x;
        if (bud === this.entity.value) return valRow.value;
        if (bud === this.entity.price) return valRow.price;
        if (bud === this.entity.amount) return valRow.amount;
        return valRow.buds[bud.id];
    }

    private setQueryBound(valRow: ValRow, bud: BizBud) {
        let v = this.getDetailBudValue(valRow, bud);
        if (v === undefined) debugger;
        this.queryRowColl[v as number] = true;
    }

    protected async uqSaveDetails(phrase: number, inDetails: InDetail[]) {
        /*
        let param: ParamSaveDetails = {
            base: this.sheetStore.mainId,
            phrase,
            inDetails,
        };
        */
        // let results = await this.uq.SaveDetails.submitReturns(param);
        let results = await this.client.SaveDetails(this.sheetStore.mainId, phrase, inDetails);
        let { details: retDetails } = results;
        if (retDetails.length === 0) {
            console.error('*************** SaveDetails something wrong *******************');
            return;
        }
        return results;
    }

    setValRowArrayToRoot(valRows: ValRow[]) {
        for (let valRow of valRows) {
            this.setValRowRoot(valRow, true);
        }
        this.setPickBound();
    }

    replaceValDiv(valDiv: ValDivBase, newValDiv: ValDivRoot) {
        const { valDivs } = this.valDivsRoot;
        let { length } = valDivs;
        let { id } = valDiv;
        for (let i = 0; i < length; i++) {
            if (id === valDivs[i].id) {
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

    getPickPendStore(pickPend: PickPend/*, valueSpace: ValueSpace*/) {
        let { id } = pickPend;
        let pps = this.pickPendStores[id];
        if (pps === undefined) {
            this.pickPendStores[id] = pps = new PickPendStore(this, pickPend/*, valueSpace*/);
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
        let valRow: ValRow = { id: -pendId, buds: {}, /*owned: {}, */pend: pendId };
        let retValDiv = new ValDivRoot(this.binDivRoot, valRow);
        this.valDivsRoot.addValDiv(retValDiv, true);
        setAtomValue(atomValDiv, retValDiv);
        return retValDiv;
    }

    addAllPendRowsToSelect() {
        let pendRows = getAtomValue(this.atomPendRows);
        for (let pendRow of pendRows) {
            this.addNewPendRow(pendRow.pend);
        }
    }

    async addAllPendRowsDirect() {
        this.addAllPendRowsToSelect();
        await this.allPendsToValRows();
    }

    deletePendThoroughly(pendId: number) {
        let atomValDiv = this.valDivsOnPend[pendId];
        this.valDivsRoot.removePend(pendId);
        setAtomValue(atomValDiv, undefined);
    }

    async allPendsToValRows(): Promise<void> {
    }
}

interface InDetail {
    id: number;
    i: number;
    x: number;
    origin: number;
    value: number;
    price: number;
    amount: number;
    pend: number;
    props: any;
}

class PendToValDiv {
    readonly vId: number;
    readonly parent: PendToValDiv;
    readonly valDiv: ValDivBase;
    readonly children: PendToValDiv[] = [];
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;

    constructor(vId: number, parent: PendToValDiv, valDiv: ValDivBase) {
        this.vId = vId;
        this.parent = parent;
        this.valDiv = valDiv;
        if (this.parent !== undefined) this.parent.children.push(this);
    }

    getValRows(inDetails: InDetail[], valRows: ValRow[]) {
        const { valRow, binDiv: { buds } } = this.valDiv;
        let { id, i, x, value, price, amount, pend, origin } = valRow;
        let propArr = getValRowPropArr(valRow, buds);
        inDetails.push({
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
        valRows.push(valRow);
        for (let p of this.children) {
            p.getValRows(inDetails, valRows);
        }
    }

    setIXBaseFromInput() {
        // const { valDiv } = row;
        // const { valRow } = valDiv;
        // valDiv.setValRow(valRow);
        // valDiv.setIXBaseFromInput(divEditing);
        this.valDiv.setIXBaseFromInput(this);
        for (let p of this.children) {
            p.setIXBaseFromInput();
        }
    }
}

// 待选之后，不需要处理待选属性值，直接生成Detail。
export class BinStorePendDirect extends BinStore {
    // pendRows 已经在单据上了
    async allPendsToValRows(): Promise<void> {
        const { valDivs } = this.valDivsRoot;
        const { length } = valDivs;
        if (length === 0) return;
        const pendRows = getAtomValue(this.atomPendRows);
        let pendToValDivs: PendToValDiv[] = [];
        let vId = 0;
        for (let i = 0; i < length; i++) {
            let valDiv = valDivs[i];
            let { valRow } = valDiv;
            const { id, pend } = valRow;
            if (id > 0) continue;
            let pendRow = pendRows.find(p => p.pend === pend);
            if (pendRow === undefined) debugger;
            let pendToValDiv = this.pendToValDiv(vId, valDiv, pendRow);
            pendToValDivs.push(pendToValDiv);
            vId = pendToValDiv.vId - 100;
        }
        await this.saveDivDetails(pendToValDivs);
        for (let p of pendToValDivs) p.setIXBaseFromInput();
        // this.sheetStore.notifyRowChange();
    }

    private pendToValDiv(vId: number, valDiv: ValDivBase, pendRow: PendRow): PendToValDiv {
        let { rearPick, pend: entityPend } = this.entity;
        let pendResult = new Proxy(pendRow, new PendProxyHandler(entityPend));
        let valRowRoot = valDiv.valRow;
        valRowRoot.pend = pendRow.pend;
        valRowRoot.pendValue = pendRow.value;

        let parent: PendToValDiv;
        let ret: PendToValDiv;
        for (; ;) {
            break;
            /*
            let divEditing = new DivEditing(this, valDiv);
            if (rearPick !== undefined) {
                divEditing.setNamedValues(rearPick.name, pendResult);
            }
            divEditing.setPendResult(pendResult);
            divEditing.calcAll();
            valDiv.mergeValRow(divEditing.values);
            let { valRow } = valDiv;
            valRow.id = vId;
            const { iValue, iBase, xValue, xBase } = divEditing;
            ret = new PendToValDiv(vId, parent, valDiv);
            ret.iValue = iValue;
            ret.iBase = iBase;
            ret.xValue = xValue;
            ret.xBase = xBase;
            vId--;

            let { binDiv } = valDiv;
            // 无下级，退出
            if (binDiv.subBinDiv === undefined) {
                // 仅仅表示有值
                // return true;
                break;
            }
            let valDivNew = valDiv.createValDivSub(pendRow);
            valDiv.addValDiv(valDivNew, true);
            valDiv = valDivNew;
            parent = ret;
            */
        }
        for (; ret !== undefined;) {
            let p = ret.parent;
            if (p === undefined) break;
            ret = p;
        }
        return ret;
    }

    private async saveDivDetails(pendToValDivs: PendToValDiv[]) {
        const valRows: ValRow[] = [];
        let inDetails: InDetail[] = [];
        for (let p of pendToValDivs) p.getValRows(inDetails, valRows);
        let results = await this.uqSaveDetails(this.entity.id, inDetails);
        if (results === undefined) return;
        let { details: retDetails, props, forks, atoms } = results;
        this.sheetStore.cacheIdAndBuds(props, atoms, forks);
        let { length } = valRows;
        for (let i = 0; i < length; i++) {
            let retDetail = retDetails[i];
            let { id } = retDetail;
            let valRow = valRows[i];
            valRow.id = id;
        }
    }
}
