import { BinDiv } from "app/Biz";
import { WritableAtom, atom } from "jotai";
import { ValRow } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";

export class ValDivs {
    readonly atomValDivs = atom([] as ValDiv[]);
    readonly atomSum = atom(get => {
        let valDivs = get(this.atomValDivs);
        let sum = 0, len = valDivs.length;
        for (let i = 0; i < len; i++) {
            let valDiv = valDivs[i];
            let v: number = 0;
            try {
                let { binDiv: { level, entityBin: { divLevels } } } = valDiv;
                if (level === divLevels) {
                    const { atomValue } = valDiv;
                    v = get(atomValue);
                }
                else {
                    const { atomSum } = valDiv;
                    v = get(atomSum);
                }
            }
            catch (err) {
                console.error(err);
                debugger;
            }
            sum += v;
        };
        return sum;
    });
    addValDiv(valDiv: ValDiv) {
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
            setAtomValue(atomValDivs, [...valDivs]);
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
        setAtomValue(this.atomValDivs, [...valDivs]);
    }
}

export class ValDiv extends ValDivs {
    readonly binDiv: BinDiv;
    readonly atomValRow: WritableAtom<ValRow, any, any>;
    readonly atomDeleted = atom(false);
    iBase: number;
    xBase: number;
    readonly atomValue = atom(get => {
        let valRow = get(this.atomValRow);
        return valRow?.value;
    });

    constructor(binDiv: BinDiv, valRow: ValRow) {
        super();
        this.binDiv = binDiv;
        this.atomValRow = atom<any>(valRow);
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

    get pend(): number {
        let valRow = getAtomValue(this.atomValRow);
        return valRow?.pend;
    }

    setValRow(valRow: any) {
        if (this.id !== valRow.id) debugger;
        setAtomValue(this.atomValRow, valRow);
    };

    setValue(value: number) {
        let valRow = getAtomValue(this.atomValRow);
        valRow.value = value;
    }

    setIXBase(valRow: ValRow) {
        let { i, x } = valRow;
        if (i !== undefined) {
            if (this.binDiv.binDivBuds.hasIBase === true) {
                this.iBase = i;
            }
        }
        if (x !== undefined) {
            if (this.binDiv.binDivBuds.hasXBase === true) {
                this.xBase = x;
            }
        }
    }
}
