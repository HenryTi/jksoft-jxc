import { BinDiv } from "app/Biz";
import { Getter, WritableAtom, atom } from "jotai";
import { ValRow } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { PendRow, SheetStore } from "./SheetStore";

export class ValDivsBase<T extends ValDivBase> {
    readonly atomValDivs = atom([] as T[]);
    readonly atomSum = atom(get => this.getSum(get));

    protected getSum(get: Getter) {
        let valDivs = get(this.atomValDivs);
        let sumValue = 0, sumAmount = 0, len = valDivs.length;
        for (let i = 0; i < len; i++) {
            let valDiv = valDivs[i];
            try {
                let { binDiv: { level, entityBin: { divLevels } } } = valDiv;
                const { atomValue, atomValRow, atomSum } = valDiv;
                if (level === divLevels) {
                    const valRow = get(atomValRow);
                    sumValue += get(atomValue);
                    sumAmount += valRow.amount ?? 0;
                }
                else {
                    const { sumAmount: a0, sumValue: v0 } = get(atomSum);
                    sumAmount += a0;
                    sumValue += v0;
                }
            }
            catch (err) {
                console.error(err);
                debugger;
            }
        };
        return { sumValue, sumAmount };
    }

    addValDiv(valDiv: T, trigger: boolean) {
        let { atomValDivs } = this;
        let valDivs = getAtomValue(atomValDivs);
        let { atomValRow } = valDiv;
        let valRow = getAtomValue(atomValRow);
        let { id } = valRow;
        let index = valDivs.findIndex(v => {
            let ivr = getAtomValue(v.atomValRow);
            return (ivr.id === id);
        });
        if (index >= 0) {
            valDivs.splice(index, 1, valDiv);
        }
        else {
            valDivs.push(valDiv);
            if (trigger === true) this.setValDivs([...valDivs]);
        }
    }
    removePend(pendId: number) {
        let valDivs = getAtomValue(this.atomValDivs);
        let len = valDivs.length;
        for (let i = 0; i < len; i++) {
            let valDiv = valDivs[i];
            let valRow = getAtomValue(valDiv.atomValRow);
            if (valRow.pend === pendId) {
                valDivs.splice(i, 1);
                break;
            }
        }
        // setAtomValue(this.atomValDivs, [...valDivs]);
        this.setValDivs([...valDivs]);
    }

    getRowCount(): number {
        let rowCount = 0;
        let valDivs = getAtomValue(this.atomValDivs);
        for (let valDiv of valDivs) {
            rowCount += valDiv.getRowCount();
        }
        return rowCount;
    }

    delValRow(id: number) {
        let divs = getAtomValue(this.atomValDivs);
        let p = divs.findIndex(v => v.id === id);
        if (p >= 0) {
            divs.splice(p, 1);
            // setAtomValue(this.atomValDivs, [...divs]);
            this.setValDivs([...divs]);
        }
    }

    setValDivs(valDivs: ValDivBase[]) {
        setAtomValue(this.atomValDivs, valDivs);
    }
}

export class ValDivsRoot extends ValDivsBase<ValDivRoot> {
}

export class ValDivs extends ValDivsBase<ValDiv> {
}

export abstract class ValDivBase extends ValDivs {
    readonly binDiv: BinDiv;
    readonly atomValRow: WritableAtom<ValRow, any, any>;
    readonly atomDeleted = atom(false);
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;
    readonly atomValue = atom(get => {
        let valRow = get(this.atomValRow);
        return valRow?.value;
    });

    constructor(binDiv: BinDiv, valRow: ValRow) {
        super();
        this.binDiv = binDiv;
        let vt: ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        this.internalMergeValRow(vt, valRow)
        this.atomValRow = atom<any>(vt);
        this.setValRowIXBase(vt);
    }

    protected override getSum(get: Getter) {
        let deleted = get(this.atomDeleted);
        if (deleted === true) {
            return { sumAmount: 0, sumValue: 0 };
        }
        let valDivs = get(this.atomValDivs);
        if (valDivs.length > 0) return super.getSum(get);
        let valRow = get(this.atomValRow);
        return {
            sumAmount: valRow.value,
            sumValue: valRow.amount,
        }
    }

    get id(): number {
        let valRow = getAtomValue(this.atomValRow);
        return valRow?.id;
    }

    set id(id: number) {
        let valRow = getAtomValue(this.atomValRow);
        valRow.id = id;
        setAtomValue(this.atomValRow, { ...valRow });
    }

    getIValue(): number {
        if (this.iValue !== undefined) return this.iValue;
        let valRow = getAtomValue(this.atomValRow);
        let { i } = valRow;
        if (i !== undefined) return i;
        let subValDivs = getAtomValue(this.atomValDivs);
        if (subValDivs.length === 0) return;
        return subValDivs[0].getIValue();
    }

    getIBase(sheetStore: SheetStore, iValue: number): number {
        if (this.iBase !== undefined) return this.iBase;
        let bizSpec = sheetStore.bizSpecColl[iValue];
        if (bizSpec === undefined) return;
        return bizSpec.atom.id;
    }

    get pend(): number {
        let valRow = getAtomValue(this.atomValRow);
        return valRow?.pend;
    }

    abstract get parent(): ValDivBase;

    get valRow(): ValRow {
        let valRow = getAtomValue(this.atomValRow);
        return valRow;
    }

    private setValRowIXBase(valRow: any) {
        let { budIBase, budXBase } = this.binDiv.binDivBuds;
        if (budIBase !== undefined) {
            this.iBase = valRow.buds[budIBase.id];
            if (this.iBase === undefined) {
                this.iBase = valRow.iBase;
            }
        }
        if (budXBase !== undefined) {
            this.xBase = valRow.buds[budXBase.id];
        }
    }

    setValRow(valRow: any) {
        if (this.id !== valRow.id) debugger;
        this.setValRowIXBase(valRow);
        setAtomValue(this.atomValRow, valRow);
    };

    setValue(value: number) {
        let valRow = getAtomValue(this.atomValRow);
        valRow.value = value;
    }

    setIValueFromInput(iValue: number): boolean {
        let { budI } = this.binDiv.binDivBuds;
        if (budI !== undefined) {
            this.iValue = iValue;
            return true;
        }
        return false;
    }

    setIBaseFromInput(iBase: number): boolean {
        let { budIBase } = this.binDiv.binDivBuds;
        if (budIBase !== undefined) {
            this.iBase = iBase;
            return true;
        }
        return false;
    }

    setXValueFromInput(xValue: number): boolean {
        let { budX } = this.binDiv.binDivBuds;
        if (budX !== undefined) {
            this.xValue = xValue;
            return true;
        }
        return false;
    }

    setXBaseFromInput(xBase: number): boolean {
        let { budXBase } = this.binDiv.binDivBuds;
        if (budXBase !== undefined) {
            this.xBase = xBase;
            return true;
        }
        return false;
    }

    setIXBaseFromInput({ iValue, iBase, xValue, xBase }: {
        iValue: number;
        iBase: number;
        xValue: number;
        xBase: number;
    }) {
        if (iValue !== undefined) {
            if (this.binDiv.binDivBuds.budI !== undefined) {
                this.iValue = iValue;
            }
            if (iBase !== undefined) {
                for (let p: ValDivBase = this; p !== undefined; p = p.parent) {
                    const { binDivBuds } = p.binDiv;
                    if (binDivBuds.budIBase !== undefined) {
                        p.iBase = iBase;
                        break;
                    }
                }
            }
        }
        if (xValue !== undefined) {
            if (this.binDiv.binDivBuds.budX !== undefined) {
                this.xValue = xValue;
            }
            for (let p: ValDivBase = this; p !== undefined; p = p.parent) {
                const { binDivBuds } = p.binDiv;
                if (binDivBuds.budXBase !== undefined) {
                    p.xBase = xBase;
                    break;
                }
            }
        }
    }

    getRowCount(): number {
        return super.getRowCount() + 1;
    }

    private internalMergeValRow(dest: ValRow, src: ValRow) {
        if (src === undefined) return;
        const { id, i, x, value, price, amount, buds, owned, pend, pendValue, origin } = src;
        if (id !== undefined) dest.id = id;
        if (i !== undefined) dest.i = i;
        if (x !== undefined) dest.x = x;
        if (value !== undefined) dest.value = value;
        if (price !== undefined) dest.price = price;
        if (amount !== undefined) dest.amount = amount;
        if (buds !== undefined) Object.assign(dest.buds, buds);
        if (owned !== undefined) Object.assign(dest.owned, owned);
        if (pend !== undefined) dest.pend = pend;
        if (pendValue !== undefined) dest.pendValue = pendValue;
        if (origin !== undefined) dest.origin = origin;
    }

    mergeValRow(src: ValRow) {
        if (src === undefined) return;
        let dest = getAtomValue(this.atomValRow);
        this.internalMergeValRow(dest, src);
        setAtomValue(this.atomValRow, { ...dest });
    }

    protected abstract cloneObj(): ValDivBase;

    clone(): ValDivBase {
        let ret = this.cloneObj();
        setAtomValue(ret.atomValDivs, [...getAtomValue(this.atomValDivs)]);
        ret.iValue = this.iValue;
        ret.iBase = this.iBase;
        ret.xValue = this.xValue;
        ret.xBase = this.xBase;
        return ret;
    }

    createValDivSub(pendRow: PendRow) {
        const { pend, value } = pendRow;
        let valRowSub = {
            ...this.valRow,
            id: undefined as number,
            origin: this.id,
            pend,
            pendValue: value
        };
        let ret = new ValDiv(this, valRowSub);
        // this.addValDiv(ret, true); // 操作完成后再加
        return ret;
    }
}

export class ValDivRoot extends ValDivBase {
    readonly rootFlag = 1;
    readonly parent: ValDivBase = undefined;

    protected cloneObj() {
        let ret = new ValDivRoot(this.binDiv, this.valRow);
        return ret;
    }
}

export class ValDiv extends ValDivBase {
    readonly parent: ValDivBase;
    constructor(parent: ValDivBase, valRow: ValRow) {
        super(parent.binDiv.subBinDiv, valRow);
        this.parent = parent;
    }

    protected cloneObj() {
        let ret = new ValDiv(this.parent, this.valRow);
        return ret;
    }
}
