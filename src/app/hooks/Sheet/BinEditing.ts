import { FormRow } from "app/coms";
import { PendRow, SheetStore } from "./SheetStore";
import { BinDiv, BizBud, BudDec, EntityBin, EnumBudType } from "app/Biz";
import { Calc, Formulas } from "../Calc";
import { RegisterOptions } from "react-hook-form";
import { WritableAtom, atom } from "jotai";
import { OwnerColl, budValuesFromProps } from "../tool";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { ValRow, Prop, arrFromJsonArr, arrFromJsonMid } from "./tool";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { NamedResults } from "./NamedResults";
import { BudValue } from "tonwa-app";

export enum ValueSetType {
    none,
    init,
    equ,
    show,
}

abstract class Field {
    readonly name: string;
    readonly bud: BizBud;
    readonly binRow: ValRow;
    readonly valueSet: string;
    readonly valueSetType: ValueSetType;
    constructor(bud: BizBud, binRow: ValRow) {
        this.name = bud.name;
        this.bud = bud;
        this.binRow = binRow;
        let { defaultValue } = bud;
        if (defaultValue !== undefined) {
            let p = defaultValue.indexOf('\n');
            if (p > 0) {
                let suffix = defaultValue.substring(p + 1);
                this.valueSet = defaultValue.substring(0, p);
                this.valueSetType = ValueSetType[suffix as keyof typeof ValueSetType];
            }
            else {
                this.valueSetType = ValueSetType.equ;
                this.valueSet = defaultValue;
            }
        }
        else {
            this.valueSetType = ValueSetType.none;
        }
    }
    abstract getValue(): any;
    abstract setValue(v: any): void;
    get required(): boolean { return this.bud.ui.required; }
}

class FieldI extends Field {
    getValue(): any { return this.binRow.i; }
    setValue(v: any) { this.binRow.i = v; }
}

class FieldX extends Field {
    getValue(): any { return this.binRow.x; }
    setValue(v: any) { this.binRow.x = v; }
}

class FieldValue extends Field {
    getValue(): any { return this.binRow.value; }
    setValue(v: any) { this.binRow.value = v; }
    get required(): boolean { return true; }
}

class FieldPrice extends Field {
    getValue(): any { return this.binRow.price; }
    setValue(v: any) { this.binRow.price = v; }
}

class FieldAmount extends Field {
    getValue(): any { return this.binRow.amount; }
    setValue(v: any) { this.binRow.amount = v; }
}

class FieldBud extends Field {
    getValue(): any { return this.binRow.buds[this.bud.id]; }
    setValue(v: any) { this.binRow.buds[this.bud.id] = v; }
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing {
    private readonly fields: Field[];
    private readonly fieldColl: { [name: string]: Field } = {};
    private readonly calc: Calc;
    private readonly requiredFields: Field[] = [];
    readonly entityBin: EntityBin;
    readonly binRow: ValRow = { buds: {} } as any;
    onDel: () => Promise<void>;

    constructor(bin: EntityBin, initBinRow?: ValRow) {
        this.entityBin = bin;
        this.fields = [];
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, props: budArr } = bin;

        let requiredFields = this.requiredFields;
        if (iBud !== undefined) {
            this.initField(new FieldI(iBud, this.binRow), false);
        }
        if (xBud !== undefined) {
            this.initField(new FieldX(xBud, this.binRow), false);
        }
        if (valueBud !== undefined) {
            this.initField(new FieldValue(valueBud, this.binRow));
        }
        if (priceBud !== undefined) {
            this.initField(new FieldPrice(priceBud, this.binRow));
        }
        if (amountBud !== undefined) {
            this.initField(new FieldAmount(amountBud, this.binRow));
        }
        for (let bud of budArr) {
            this.initField(new FieldBud(bud, this.binRow));
        }
        const formulas: Formulas = [];
        for (let i in this.fieldColl) {
            let f = this.fieldColl[i];
            let { name, bud, valueSet, valueSetType, required } = f;
            this.fieldColl[name] = f;
            let { ui, budDataType: { min, max } } = bud;
            let { show } = ui;
            if (show === true) continue;
            if (valueSet !== undefined) {
                formulas.push([name, valueSet]);
                if (valueSetType === ValueSetType.init) {
                    if (required === true) requiredFields.push(f);
                }
            }
            else {
                if (required === true) requiredFields.push(f);
            }
            if (min !== undefined) {
                formulas.push([name + '.min', min]);
            }
            if (max !== undefined) {
                formulas.push([name + '.max', max]);
            }
        }
        this.calc = new Calc(formulas, this.binRow as any);
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    private initField(field: Field, onForm: boolean = true) {
        this.fieldColl[field.name] = field;
        if (onForm === true) this.fields.push(field);
    }

    setNamedParams(namedResults: { [name: string]: any }) {
        this.calc.addValues(undefined, namedResults);
        const { results } = this.calc;
        for (let i in this.fieldColl) {
            let field = this.fieldColl[i];
            field.setValue(results[field.name]);
        }
    }

    private setValues(binRow: ValRow) {
        Object.assign(this.binRow, binRow);
        //this.calc.addValues(undefined, binDetail);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.calc.addValues(undefined, obj);
    }

    setValue(name: string, value: number | string, callback: (name: string, value: string | number) => void) {
        const c = (name: string, value: string | number) => {
            callback?.(name, value);
            this.setFieldOrBudValue(name, value);
        }
        this.setFieldOrBudValue(name, value);
        this.calc.setValue(name, value, c);
    }

    private setFieldOrBudValue(name: string, value: number | string) {
        let field = this.fieldColl[name];
        if (field === undefined) {
            console.error('RowStore setFieldOrBudValue not defined name=', name)
            // debugger;
            return;
        }
        field.setValue(value);
    }

    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = field.getValue(); // this.calc.results[field.name];
            if (v === undefined) {
                return false;
            }
        }
        return ret;
    }

    onChange(name: string, type: 'text' | 'number', valueInputText: string, callback: (name: string, value: string | number) => void) {
        let valueInput: any;
        if (type === 'number') {
            if (valueInputText.trim().length === 0) {
                valueInput = undefined;
            }
            else {
                let v = Number(valueInputText);
                valueInput = Number.isNaN(v) === true ? undefined : v;
            }
        }
        else if (type === 'text') {
            if (valueInputText.trim().length === 0) {
                valueInput = undefined;
            }
            else {
                valueInput = valueInputText;
            }
        }
        this.setValue(name, valueInput, (name, value) => {
            // setValue(name, value);
            callback(name, value);
        });
        // setSubmitable(rowStore.submitable);
    }

    buildFormRows(): FormRow[] {
        let ret: FormRow[] = [];
        const { results: calcResults } = this.calc;
        for (let field of this.fields) {
            const { name, bud, valueSetType, required } = field;
            const { caption, budDataType, ui } = bud;
            let { show } = ui;
            if (show === true) continue;
            let options: RegisterOptions = {
                value: field.getValue(),
                disabled: valueSetType === ValueSetType.equ,
                required,
            };
            let formRow = {
                name,
                label: caption ?? name,
                type: 'number',
                options,
                required,
            } as any;
            const { type, min, max } = budDataType;
            switch (type) {
                case EnumBudType.atom:
                    formRow.default = field.getValue();
                    formRow.atom = null;
                    formRow.readOnly = true;
                    break;
                case EnumBudType.char:
                case EnumBudType.str:
                    formRow.type = 'text';
                    break;
                case EnumBudType.dec:
                    let step: string = '0.000001';
                    const { fraction } = budDataType as BudDec;
                    if (fraction !== undefined) {
                        step = String(1 / Math.pow(10, fraction));
                        formRow.step = step;
                    }
                    formRow.options.valueAsNumber = true;
                    if (min !== undefined) {
                        formRow.options.min = calcResults[`${name}.min`];
                    }
                    if (max !== undefined) {
                        formRow.options.max = calcResults[`${name}.max`];
                    }
                    break;
            }
            ret.push(formRow);
        }
        return ret;
    }
}

export class BinStore {
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
                binDiv = this.binDiv.getLevelDiv(level);
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
    binStore: BinStore;
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
