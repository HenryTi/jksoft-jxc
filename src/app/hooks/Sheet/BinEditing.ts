import { FormRow } from "app/coms";
import { BinDetail, BinRow } from "./SheetStore";
import { BizBud, BudDec, EntityBin, EnumBudType } from "app/Biz";
import { Calc, Formulas } from "../Calc";
import { RegisterOptions } from "react-hook-form";

export enum ValueSetType {
    none,
    init,
    equ,
    show,
}

abstract class Field {
    readonly name: string;
    readonly bud: BizBud;
    readonly binRow: BinRow;
    readonly valueSet: string;
    readonly valueSetType: ValueSetType;
    constructor(bud: BizBud, binRow: BinRow) {
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
    private readonly entityBin: EntityBin;
    private readonly fields: Field[];
    private readonly fieldColl: { [name: string]: Field } = {};
    private readonly calc: Calc;
    private readonly requiredFields: Field[] = [];
    readonly binRow: BinRow = { buds: {} } as any;
    constructor(bin: EntityBin) {
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
    }

    private initField(field: Field, onForm: boolean = true) {
        this.fieldColl[field.name] = field;
        if (onForm === true) this.fields.push(field);
    }

    init(picked: { [name: string]: any }) {
        this.calc.addValues(undefined, picked);
        const { results } = this.calc;
        for (let i in this.fieldColl) {
            let field = this.fieldColl[i];
            field.setValue(results[field.name]);
        }
    }

    setValues(binRow: BinRow) {
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
            let v = this.calc.results[field.name];
            if (v === undefined) return false;
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
