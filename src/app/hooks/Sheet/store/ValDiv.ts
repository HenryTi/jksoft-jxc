import { BinDiv, BizBud } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { ValRow } from "../tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { BinBuds } from "./BinEditing";

export class ValDiv {
    // readonly binDiv: BinDiv;
    readonly binBuds: BinBuds;
    readonly atomValRow: WritableAtom<ValRow, any, any>;
    readonly atomValDivs: WritableAtom<ValDiv[], any, any>;
    readonly atomValue: WritableAtom<number, any, any>;
    readonly id: number;
    constructor(binDiv: BinDiv, valRow: ValRow) {
        this.binBuds = new BinBuds(binDiv);
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

    setValRow(valRow: any) {
        if (this.id !== valRow.id) debugger;
        setAtomValue(this.atomValRow, valRow);
    };

    setValue(value: number) {
        let valRow = getAtomValue(this.atomValRow);
        valRow.value = value;
        setAtomValue(this.atomValue, value);
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
        let valRow = getAtomValue(this.atomValRow);
        return this.binBuds.fields.map(
            field => {
                let { bud } = field;
                return [bud, field.getValue(valRow)];
            }
        );
    }
}
