import { PendRow, SheetStore } from "./SheetStore";
import { BinDiv, EntityBin } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { OwnerColl, budValuesFromProps } from "../../tool";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { ValRow, Prop, arrFromJsonArr, arrFromJsonMid } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { NamedResults } from "./NamedResults";
import { ValDiv, ValDivs } from './ValDiv';

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
    private valColl: { [id: number]: ValDiv };
    private pendLoadState: PendLoadState;
    readonly sheetStore: SheetStore;
    readonly entityBin: EntityBin;
    readonly binDiv: BinDiv;
    pendColl: { [pend: number]: WritableAtom<ValDiv, any, any> };
    pendRows: PendRow[];
    ownerColl: OwnerColl;
    readonly valDivs: ValDivs;
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;

    constructor(sheetStore: SheetStore, entityBin: EntityBin) {
        this.sheetStore = sheetStore;
        this.entityBin = entityBin;
        this.binDiv = entityBin.div;
        this.valDivs = new ValDiv(entityBin.div, undefined);
        this.valColl = {};
        this.pendLoadState = PendLoadState.none;
        this.atomSubmitState = atom((get) => {
            const { atomValDivs } = this.valDivs;
            if (atomValDivs === undefined) return SubmitState.none;
            let valDivs = get(atomValDivs);
            let hasValue = false;
            if (valDivs.length === 0) return SubmitState.none;
            for (let valDiv of valDivs) {
                const { atomValue, atomValRow } = valDiv;
                let value = get(atomValue);
                let valRow = get(atomValRow);
                if (value !== undefined) hasValue = true;
                if (value > valRow.pendValue) return SubmitState.disable;
            }
            return hasValue === true ? SubmitState.enable : SubmitState.hide;
        }, null);
    }

    async loadPend(params: any): Promise<void> {
        if (this.pendLoadState !== PendLoadState.none) return;
        this.pendRows = undefined;
        this.pendColl = {};
        this.pendLoadState = PendLoadState.loading;
        const { pendRows,
            ownerColl
        } = await this.loadPendInternal(params, undefined);
        this.pendLoadState = PendLoadState.loaded;
        this.pendRows = pendRows;
        this.ownerColl = ownerColl;
        const { atomValDivs } = this.valDivs;
        if (atomValDivs !== undefined) {
            let valDivs = getAtomValue(atomValDivs);
            for (let valDiv of valDivs) {
                let valRow = getAtomValue(valDiv.atomValRow);
                this.setPend(valRow.pend, valDiv);
            }
        }
    }

    setReload() {
        this.pendLoadState = PendLoadState.none;
    }

    async loadPendId(pendId: number): Promise<void> {
        if (this.pendColl === undefined) this.pendColl = {};
        const {
            pendRows,
            ownerColl
        } = await this.loadPendInternal({}, pendId);
        if (this.pendRows === undefined) {
            this.pendRows = pendRows;
        }
        else {
            this.pendRows.push(...pendRows);
        }
        if (this.ownerColl === undefined) {
            this.ownerColl = ownerColl;
        }
        else {
            Object.assign(this.ownerColl, ownerColl);
        }
    }

    private async loadPendInternal(params: any, pendId: number) {
        let { pend: entityPend } = this.entityBin;
        if (entityPend === undefined) debugger;
        let ret = await this.sheetStore.uqGetPend(entityPend, params, pendId);
        let { $page, retSheet, props: showBuds } = ret;
        const { ownerColl } = budValuesFromProps(showBuds);
        let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
        for (let v of retSheet) {
            collSheet[v.id] = v;
        };
        let pendRows: PendRow[] = [];
        // build pendColl;
        for (let v of $page) {
            let { id, pend, pendValue, mid, cols } = v;
            if (pendValue === undefined || pendValue <= 0) continue;
            this.pendColl[pend] = atom(undefined as ValDiv);
            let propArr: Prop[];
            if (cols !== undefined) {
                propArr = arrFromJsonArr(entityPend, cols);
            }
            let midArr = arrFromJsonMid(entityPend, mid);
            let pendRow: PendRow = {
                pend,
                detail: { ...v, buds: {}, owned: undefined },
                origin: id,
                value: pendValue,
                mid: midArr,
                cols: propArr,
            };
            pendRows.push(pendRow);
        }
        return {
            pendRows,
            ownerColl,
        }
    }

    load(valRows: ValRow[]) {
        this.setValRows(valRows, false);
    }

    setValRows(valRows: ValRow[], trigger: boolean) {
        for (let valRow of valRows) {
            this.setValRowInternal(valRow, trigger);
        }
    }

    getPendLeft(valDiv: ValDiv): number {
        if (valDiv === undefined) return undefined;
        function has(valDivs: ValDivs, valDiv: ValDiv) {
            let vds = getAtomValue(valDivs.atomValDivs);
            for (let vd of vds) {
                if (vd === valDiv) return true;
                if (has(vd, valDiv) === true) return true;
            }
            return false;
        }
        let vds = getAtomValue(this.valDivs.atomValDivs);
        for (let vd of vds) {
            if (has(vd, valDiv) === true) {
                let { atomValRow, atomValue } = vd;
                let value = getAtomValue(atomValue);
                let valRow = getAtomValue(atomValRow);
                let { pend } = valRow;
                let pendRow = this.pendRows?.find(v => v.pend === pend);
                if (pendRow === undefined) {
                    debugger;
                    return 0;
                }
                return pendRow.value - value;
            }
        }
        return undefined;
    }

    async delValRow(id: number) {
        let val = this.valColl[id];
        let valRow = getAtomValue(val.atomValRow);
        const { origin } = valRow;
        let valDiv = this.valColl[origin];
        let atomValDivs: WritableAtom<ValDiv[], any, any>;
        if (valDiv === undefined) {
            // top div
            atomValDivs = this.valDivs.atomValDivs;
            const { pend } = valRow;
            if (this.pendColl !== undefined) {
                let _valDiv = this.pendColl[pend];
                setAtomValue(_valDiv, undefined);
            }
        }
        else {
            atomValDivs = valDiv.atomValDivs;
        }
        let divs = getAtomValue(atomValDivs);
        let p = divs.findIndex(v => v.id === id);
        if (p < 0) {
            debugger;
            return;
        }
        await this.sheetStore.delDetail(id);
        divs.splice(p, 1);
        setAtomValue(atomValDivs, [...divs]);
    }

    setValRow(valRow: ValRow) {
        this.setValRowInternal(valRow, true);
    }

    private setValRowInternal(valRow: ValRow, trigger: boolean) {
        const { pend } = valRow;
        let val = this.setVal(valRow, trigger);
        this.setPend(pend, val);
    }

    private setPend(pend: number, val: ValDiv) {
        if (this.pendColl === undefined) return;
        let valAtom = this.pendColl[pend];
        if (valAtom === undefined) {
            this.pendColl[pend] = atom(val);
        }
        else {
            let atomValue = getAtomValue(valAtom);
            if (atomValue === undefined) {
                setAtomValue(valAtom, val);
            }
        }
    }

    private setVal(valRow: ValRow, trigger: boolean): ValDiv {
        let { id, origin } = valRow;
        let valDiv = this.valColl[id];
        if (valDiv === undefined) {
            let parentValDivs: ValDivs;
            let binDiv: BinDiv;
            if (origin === undefined) {
                parentValDivs = this.valDivs;
                binDiv = this.binDiv;
            }
            else {
                let parentValDiv = this.valColl[origin];
                binDiv = this.binDiv;
                if (parentValDiv === undefined) {
                    parentValDivs = this.valDivs;
                }
                else {
                    // 获取层级值
                    let level = 0;
                    for (let p = parentValDiv; p !== undefined; level++) {
                        const { origin: pOrigin } = getAtomValue(p.atomValRow);
                        p = this.valColl[pOrigin];
                    }
                    for (let i = 0; i < level; i++) {
                        binDiv = binDiv.div;
                    }
                    if (binDiv === undefined) debugger;
                    parentValDivs = parentValDiv;
                    parentValDiv.setIXBase(valRow);
                }
            }
            valDiv = this.setSub(binDiv, parentValDivs, valRow, trigger);
        }
        else {
            valDiv.setValRow(valRow);
        }
        return valDiv;
    }

    private setSub(binDiv: BinDiv, valDivs: ValDivs, valRow: ValRow, trigger: boolean) {
        let { id } = valRow;
        const { atomValDivs } = valDivs;
        if (atomValDivs === undefined) {
            debugger;
            return;
        }
        let divs = getAtomValue(atomValDivs);
        let subVal = new ValDiv(binDiv, valRow);
        this.valColl[id] = subVal;
        divs.push(subVal);
        if (trigger === true) {
            setAtomValue(atomValDivs, [...divs]);
        }
        return subVal;
    }

    setValColl(valDiv: ValDiv) {
        this.valColl[valDiv.id] = valDiv;
    }

    async getPendRow(pend: number) {
        let ret = this.pendRows?.find(v => v.pend === pend);
        if (ret === undefined) {
            await this.loadPendId(pend);
            ret = this.pendRows.find(v => v.pend === pend);
        }
        return ret;
    }

    async saveDetail(binDiv: BinDiv, valRow: ValRow) {
        const { buds } = binDiv;
        let retId = await this.sheetStore.saveDetail(binDiv.entityBin, buds, valRow);
        return retId;
    }
}

export interface DivEditProps {
    divStore: DivStore;
    pendRow: PendRow;
    namedResults: NamedResults;
}

export interface UseInputsProps extends DivEditProps {
    binDiv: BinDiv;
    valDiv: ValDiv;
}
