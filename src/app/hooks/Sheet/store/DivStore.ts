import { PendRow, SheetStore } from ".";
import { BinDiv, EntityBin } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { OwnerColl, budValuesFromProps } from "../../tool";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { ValRow, Prop, arrFromJsonArr, arrFromJsonMid } from "../tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { NamedResults } from "../NamedResults";
import { UqApp } from "app";
import { Modal } from "tonwa-app";

export class DivStore {
    private valColl: { [id: number]: ValDiv };
    readonly sheetStore: SheetStore;
    readonly entityBin: EntityBin;
    readonly binDiv: BinDiv;
    pendColl: { [pend: number]: WritableAtom<ValDiv, any, any> };
    pendRows: PendRow[];
    ownerColl: OwnerColl;
    readonly valDiv: ValDiv;

    constructor(sheetStore: SheetStore, entityBin: EntityBin) {
        this.sheetStore = sheetStore;
        this.entityBin = entityBin;
        this.binDiv = entityBin.div;
        this.valDiv = new ValDiv(entityBin.div, undefined/*, 0*/);
        this.valColl = {};
    }

    async loadPend(params: any): Promise<void> {
        if (this.pendRows !== undefined) return;
        let { pend: entityPend } = this.entityBin;
        if (entityPend === undefined) debugger;
        let ret = await this.sheetStore.uq.GetPend.page({ pend: entityPend.id, params }, undefined, 100);
        this.pendColl = {};
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
            let propArr: Prop[] = arrFromJsonArr(entityPend, cols);
            let midArr = arrFromJsonMid(entityPend, mid);
            let pendRow: PendRow = {
                pend,
                // sheet: { ...collSheet[v.sheet], buds: {}, owned: undefined },
                detail: { ...v, buds: {}, owned: undefined },
                origin: id,
                value: pendValue,
                mid: midArr,
                cols: propArr,
            };
            pendRows.push(pendRow);
        }
        this.pendRows = pendRows;
        this.ownerColl = ownerColl;
        // return { pendRows, ownerColl };
    }

    load(valRows: ValRow[]) {
        this.setValRows(valRows, false);
    }

    setValRows(valRows: ValRow[], trigger: boolean) {
        for (let valRow of valRows) {
            this.setValRowInternal(valRow, trigger);
        }
    }

    delValRow(id: number) {
        let val = this.valColl[id];
        let valRow = getAtomValue(val.atomValRow);
        const { origin } = valRow;
        let valParent = this.valColl[origin];
        if (valParent === undefined) {
            valParent = this.valDiv;
        }
        const { atomDivs } = valParent;
        let divs = getAtomValue(atomDivs);
        let p = divs.findIndex(v => v.id === id);
        if (p < 0) debugger;
        divs.splice(p, 1);
        setAtomValue(atomDivs, [...divs]);
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
        let atom = this.pendColl[pend];
        let atomValue = getAtomValue(atom);
        if (atomValue === undefined) {
            setAtomValue(atom, val);
        }
    }

    private setVal(valRow: ValRow, trigger: boolean) {
        let { id, origin: parent } = valRow;
        let val = this.valColl[id];
        if (val === undefined) {
            let parentVal: ValDiv;
            let binDiv: BinDiv;
            if (parent === undefined) {
                parentVal = this.valDiv;
                binDiv = this.binDiv;
            }
            else {
                parentVal = this.valColl[parent];
                if (parentVal === undefined) debugger;
                // 获取层级值
                let level = 0;
                for (let p = parentVal; p !== undefined; level++) {
                    const { origin: pOrigin } = getAtomValue(p.atomValRow);
                    p = this.valColl[pOrigin];
                }
                // if (level !== parentVal.level) debugger;
                // binDiv = this.binDiv.getLevelDiv(level);
                binDiv = this.binDiv;
                for (let i = 0; i < level; i++) {
                    binDiv = binDiv.div;
                }
                if (binDiv === undefined) debugger;
                /*
                for (let p = binDiv; p.div != undefined; p = p.div) {
                    const { atomDivs } = parentVal;
                    if (atomDivs === undefined) break;
                    let divs = getAtomValue(atomDivs);
                    let vd = divs.find(v => v.id === parent);
                    if (vd === undefined) break;
                    parentVal = vd;
                    binDiv = p.div;
                }
                */
            }
            val = this.setSub(binDiv, parentVal, valRow, trigger);
        }
        else {
            val.setValRow(valRow);
        }
        return val;
    }

    private setSub(binDiv: BinDiv, valDiv: ValDiv, valRow: ValRow, trigger: boolean) {
        //let ret: ValDiv;
        let { id } = valRow;
        // let level = valDiv.level + 1;
        //for (let p = binDiv; p !== undefined; p = p.div, level++) {
        const { atomDivs } = valDiv;
        if (atomDivs === undefined) {
            // break;
            debugger;
            return;
        }
        let divs = getAtomValue(atomDivs);
        let subVal = new ValDiv(binDiv, valRow/*, level*/);
        this.valColl[id] = subVal;
        //if (ret === undefined) {
        //    ret = subVal;
        //}
        divs.push(subVal);
        //valDiv = subVal;
        if (trigger === true) {
            setAtomValue(atomDivs, [...divs]);
        }
        //}
        /*
        if (this.valColl[id] === undefined) {
            if (ret === undefined) debugger;
            this.valColl[id] = ret;
        }
        return ret;
        */
        return subVal;
    }
}

export interface DivEditProps {
    binStore: DivStore;
    namedResults: NamedResults;
    pendRow: PendRow;
}

export interface UseInputsProps extends DivEditProps {
    binDiv: BinDiv;
    valDiv: ValDiv;
}

// origin 指向本单时，构成行层级结构。
/*
export type BinRow = {
    id: number;
    i?: number;
    x?: number;
    value?: number;
    price?: number;
    amount?: number;
    buds?: { [bud: number]: string | number };
    owned?: { [bud: number]: [number, BudValue][] };
    origin: number;     // origin可能指向源单id，也指向本单parent。
    pend: number;
};
*/

export class ValDiv {
    readonly atomValRow: WritableAtom<ValRow, any, any>;
    readonly atomDivs: WritableAtom<ValDiv[], any, any>;
    readonly atomValue: WritableAtom<number, any, any>;
    readonly id: number;
    constructor(binDiv: BinDiv, valRow: ValRow) {
        if (valRow !== undefined) {
            const { value, id } = valRow;
            this.atomValRow = atom<any>(valRow);
            this.id = id;
            this.atomValue = atom(value ?? 0);
        }
        if (binDiv.div !== undefined) {
            this.atomDivs = atom<ValDiv[]>([]);
            this.atomValue = atom(
                get => {
                    let divs = get(this.atomDivs);
                    let sum = divs.reduce((sum: number, div: ValDiv) => {
                        let v = get(div.atomValue);
                        return sum + v;
                    }, 0);
                    return sum;
                },
                (get, set, newVal) => {
                }
            )
        }
    }

    setValRow(valRow: any) {
        if (this.id !== valRow.id) debugger;
        setAtomValue(this.atomValRow, valRow);
    };

    setValue(value: number) {
        let valRow = getAtomValue(this.atomValRow);
        valRow.value = value;
        setAtomValue(this.atomValue, value);
    }
}
