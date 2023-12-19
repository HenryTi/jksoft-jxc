import { PendRow, SheetStore } from "./SheetStore";
import { BinDiv, BinRow, EntityBin, EnumBudType } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { OwnerColl, budValuesFromProps } from "../../tool";
import { ParamSaveDetail, ReturnGetPendRetSheet } from "uqs/UqDefault";
import { ValRow, Prop, arrFromJsonArr, arrFromJsonMid } from "../tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { NamedResults } from "../NamedResults";
import { ValDiv } from './ValDiv';

export class DivStore {
    private valColl: { [id: number]: ValDiv };
    readonly sheetStore: SheetStore;
    readonly entityBin: EntityBin;
    readonly binDiv: BinDiv;
    namedResults: NamedResults;
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
        const { atomValDivs: atomDivs } = valParent;
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
                binDiv = this.binDiv;
                for (let i = 0; i < level; i++) {
                    binDiv = binDiv.div;
                }
                if (binDiv === undefined) debugger;
            }
            val = this.setSub(binDiv, parentVal, valRow, trigger);
        }
        else {
            val.setValRow(valRow);
        }
        return val;
    }

    private setSub(binDiv: BinDiv, valDiv: ValDiv, valRow: ValRow, trigger: boolean) {
        let { id } = valRow;
        const { atomValDivs: atomDivs } = valDiv;
        if (atomDivs === undefined) {
            debugger;
            return;
        }
        let divs = getAtomValue(atomDivs);
        let subVal = new ValDiv(binDiv, valRow);
        this.valColl[id] = subVal;
        divs.push(subVal);
        if (trigger === true) {
            setAtomValue(atomDivs, [...divs]);
        }
        return subVal;
    }

    setValColl(valDiv: ValDiv) {
        this.valColl[valDiv.id] = valDiv;
    }

    getPendRow(pend: number) {
        return this.pendRows.find(v => v.pend === pend);
    }

    async saveDetail(binDiv: BinDiv, binRow: BinRow, pend: number, origin: number) {
        let { id, i, x, value, price, amount, buds: budsValues } = binRow;
        const { buds } = binDiv;

        let propArr: [number, 'int' | 'dec' | 'str', string | number][] = [];
        for (let bud of buds) {
            let { id, name, budDataType } = bud;
            let value = (budsValues as any)[id];
            if (value === undefined) continue;
            let type: 'int' | 'dec' | 'str';
            switch (budDataType.type) {
                default:
                case EnumBudType.atom:
                case EnumBudType.int: type = 'int'; break;
                case EnumBudType.dec: type = 'dec'; break;
                case EnumBudType.str:
                case EnumBudType.char: type = 'str'; break;
            }
            if (type === undefined) continue;
            propArr.push([id, type, value]);
        }

        let param: ParamSaveDetail = {
            base: this.sheetStore.main.binRow.id,
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
        let retSaveDetail = await this.sheetStore.uq.SaveDetail.submitReturns(param);
        id = retSaveDetail.ret[0].id;
        return id;
    }
}

export interface DivEditProps {
    divStore: DivStore;
    pendRow: PendRow;
}

export interface UseInputsProps extends DivEditProps {
    binDiv: BinDiv;
}
