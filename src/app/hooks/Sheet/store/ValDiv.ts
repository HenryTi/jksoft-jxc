import { BinDiv, BinRow, BizBud } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { ValRow } from "../tool";
import { getAtomValue, setAtomValue } from "tonwa-com";

export class ValDiv {
    readonly binDiv: BinDiv;
    readonly atomValRow: WritableAtom<ValRow, any, any>;
    readonly atomValDivs: WritableAtom<ValDiv[], any, any>;
    readonly atomValue: WritableAtom<number, any, any>;
    id: number;
    iBase: number;
    xBase: number;
    constructor(binDiv: BinDiv, valRow: ValRow) {
        this.binDiv = binDiv;
        if (binDiv.div !== undefined) {
            this.atomValDivs = atom<ValDiv[]>([]);
            this.atomValue = atom(
                get => {
                    let valDivs = get(this.atomValDivs);
                    let sum = 0, len = valDivs.length;
                    for (let i = 0; i < len; i++) {
                        let valDiv = valDivs[i];
                        let v: number = 0;
                        try {
                            let { atomValue } = valDiv;
                            if (atomValue !== undefined) v = get(atomValue);
                        }
                        catch (err) {
                            console.error(err);
                            debugger;
                        }
                        sum += v;
                    };
                    return sum;
                },
                (get, set, newVal) => {
                }
            )
        }
        if (valRow !== undefined) {
            const { value, id } = valRow;
            this.atomValRow = atom<any>(valRow);
            this.id = id;
            if (this.atomValue === undefined) {
                this.atomValue = atom(value ?? 0);
            }
        }
    }

    setId(id: number) {
        this.id = id;
        let valRow = getAtomValue(this.atomValRow);
        valRow.id = id;
        setAtomValue(this.atomValRow, { ...valRow });
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

    setIXBase(binRow: BinRow) {
        let { i, x } = binRow;
        if (i !== undefined) {
            if (this.binDiv.binBuds.hasIBase === true) {
                this.iBase = i;
            }
        }
        if (x !== undefined) {
            if (this.binDiv.binBuds.hasXBase === true) {
                this.xBase = x;
            }
        }
    }

    setValDiv(valDiv: ValDiv) {
        let { atomValDivs } = this;
        if (atomValDivs !== undefined) {
            let valDivs = getAtomValue(atomValDivs);
            valDivs.push(valDiv);
            setAtomValue(atomValDivs, [...valDivs]);
        }
    }

    getBudsValArr(): [BizBud, any][] {
        const { binBuds } = this.binDiv;
        const { valueBud } = binBuds;
        let valRow = getAtomValue(this.atomValRow);
        let ret: [BizBud, any][] = [];
        for (let field of this.binDiv.binBuds.fields) {
            let { bud } = field;
            if (bud === valueBud) continue;
            ret.push([bud, field.getValue(valRow)]);
        }
        return ret;
    }
}
