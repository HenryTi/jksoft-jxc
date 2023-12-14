import { RegisterOptions } from "react-hook-form";
import { FormRow } from "app/coms";
import { BinDiv, BizBud, BudDec, BudRadio, EntityBin, EnumBudType } from "app/Biz";
import { Calc, Formulas } from "../../Calc";
import { BinRow, ValRow } from "../tool";
import { DivStore } from ".";

export enum ValueSetType {
    none,
    init,
    equ,
    show,
}

abstract class BinField {
    readonly name: string;
    readonly bud: BizBud;
    // readonly binRow: BinRow;
    readonly valueSet: string;
    readonly valueSetType: ValueSetType;
    constructor(bud: BizBud/*, binRow: BinRow*/) {
        this.name = bud.name;
        this.bud = bud;
        // this.binRow = binRow;
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
    abstract getValue(binRow: BinRow): any;
    abstract setValue(binRow: BinRow, v: any): void;
    get required(): boolean { return this.bud.ui.required; }
}

class FieldI extends BinField {
    getValue(binRow: BinRow): any { return binRow.i; }
    setValue(binRow: BinRow, v: any) { binRow.i = v; }
}

class FieldX extends BinField {
    getValue(binRow: BinRow): any { return binRow.x; }
    setValue(binRow: BinRow, v: any) { binRow.x = v; }
}

class FieldValue extends BinField {
    getValue(binRow: BinRow): any { return binRow.value; }
    setValue(binRow: BinRow, v: any) { binRow.value = v; }
    get required(): boolean { return true; }
}

class FieldPrice extends BinField {
    getValue(binRow: BinRow): any { return binRow.price; }
    setValue(binRow: BinRow, v: any) { binRow.price = v; }
}

class FieldAmount extends BinField {
    getValue(binRow: BinRow): any { return binRow.amount; }
    setValue(binRow: BinRow, v: any) { binRow.amount = v; }
}

class FieldBud extends BinField {
    getValue(binRow: BinRow): any { return binRow.buds[this.bud.id]; }
    setValue(binRow: BinRow, v: any) { binRow.buds[this.bud.id] = v; }
}

class BudsFields {
    protected readonly fieldColl: { [name: string]: BinField } = {};
    readonly entityBin: EntityBin;
    readonly fields: BinField[];
    constructor(bin: EntityBin, buds: BizBud[]) {
        this.entityBin = bin;
        this.fields = [];
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, props: budArr } = bin;

        function fieldOfBud(bud: BizBud): [new (bud: BizBud) => BinField, boolean?] {
            if (budArr.findIndex(v => v === bud) >= 0) return [FieldBud];
            if (bud === iBud) return [FieldI, false];
            if (bud === xBud) return [FieldX, false];
            if (bud === valueBud) return [FieldValue];
            if (bud === priceBud) return [FieldPrice];
            if (bud === amountBud) return [FieldAmount];
            // debugger; .i will not list here
            return undefined;
        }

        for (let bud of buds) {
            let ret = fieldOfBud(bud);
            if (ret === undefined) continue;
            let [Field, onForm] = ret;
            let field = new Field(bud);
            this.fieldColl[field.name] = field;
            if (onForm === false) continue;
            this.fields.push(field);
        }
    }
}

export class BinBuds extends BudsFields {
    readonly binDiv: BinDiv;
    constructor(binDiv: BinDiv) {
        super(binDiv.entityBin, binDiv.buds);
        this.binDiv = binDiv;
    }
}

abstract class BinFields extends BudsFields {
    /*
    private readonly fields: BinField[];
    private readonly fieldColl: { [name: string]: BinField } = {};
    readonly entityBin: EntityBin;
    */
    private readonly calc: Calc;
    private readonly requiredFields: BinField[] = [];
    readonly valRow: ValRow = { buds: {} } as any;
    onDel: () => Promise<void>;

    constructor(bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        super(bin, buds);
        // this.entityBin = bin;
        // this.fields = [];
        /*
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, props: budArr } = bin;

        function fieldOfBud(bud: BizBud): [new (bud: BizBud, binRow: BinRow) => BinField, boolean?] {
            if (budArr.findIndex(v => v === bud) >= 0) return [FieldBud];
            if (bud === iBud) return [FieldI, false];
            if (bud === xBud) return [FieldX, false];
            if (bud === valueBud) return [FieldValue];
            if (bud === priceBud) return [FieldPrice];
            if (bud === amountBud) return [FieldAmount];
            // debugger; .i will not list here
            return undefined;
        }

        for (let bud of buds) {
            let ret = fieldOfBud(bud);
            if (ret === undefined) continue;
            let [Field, onForm] = ret;
            let field = new Field(bud, this.valRow);
            this.fieldColl[field.name] = field;
            if (onForm === false) continue;
            this.fields.push(field);
        }
        */
        let requiredFields = this.requiredFields;
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
        this.calc = new Calc(formulas, this.valRow as any);
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    setNamedParams(namedResults: { [name: string]: any }) {
        this.calc.addValues(undefined, namedResults);
        const { results } = this.calc;
        for (let i in this.fieldColl) {
            let field = this.fieldColl[i];
            field.setValue(this.valRow, results[field.name]);
        }
    }

    private setValues(binRow: BinRow) {
        Object.assign(this.valRow, binRow);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.calc.addValues(undefined, obj);
    }

    // init formula only valid in init
    stopInitFormula() {
        for (let field of this.fields) {
            if (field.valueSetType === ValueSetType.init) {
                this.calc.stopFormula(field.name);
            }
        }
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
            return;
        }
        /*
            console.error('RowStore setFieldOrBudValue not defined name=', name)
            debugger;
            return;
        */
        field.setValue(this.valRow, value);
    }

    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = field.getValue(this.valRow); // this.calc.results[field.name];
            if (v === undefined) {
                return false;
            }
        }
        return ret;
    }

    onChange(name: string, type: 'text' | 'number' | 'radio', valueInputText: string
        , callback: (name: string, value: string | number) => void) {
        let valueInput: any;
        switch (type) {
            default: debugger; break;
            case 'number':
                if (valueInputText.trim().length === 0) {
                    valueInput = undefined;
                }
                else {
                    let v = Number(valueInputText);
                    valueInput = Number.isNaN(v) === true ? undefined : v;
                }
                break;
            case 'text':
                if (valueInputText.trim().length === 0) {
                    valueInput = undefined;
                }
                else {
                    valueInput = valueInputText;
                }
                break;
            case 'radio':
                valueInput = Number(valueInputText);
                break;
        }
        this.setValue(name, valueInput, (name, value) => {
            // setValue(name, value);
            callback(name, value);
        });
        // setSubmitable(rowStore.submitable);
    }

    get results() { return this.calc.results; }

    isInputNeeded(): boolean {
        for (let field of this.fields) {
            const { bud, valueSetType } = field;
            const { ui } = bud;
            let { show } = ui;
            if (show === true) continue;
            switch (valueSetType) {
                case ValueSetType.none:
                case ValueSetType.init: return true;
            }
        }
        return false;
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
                value: field.getValue(this.valRow),
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
                    formRow.default = field.getValue(this.valRow);
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
                case EnumBudType.radio:
                    formRow.radios = budRadios(budDataType as BudRadio);
                    break;
                case EnumBudType.check:
                    debugger; // impossible
                    break;
            }
            ret.push(formRow);
        }
        return ret;
    }
}

function budRadios(budDataType: BudRadio): { label: string; value: string | number }[] {
    let ret: { label: string; value: string | number }[] = [];
    let { options } = budDataType;
    for (let option of options.items) {
        let { id, name, caption } = option;
        ret.push({ label: caption ?? name, value: id });
    }
    return ret;
}

export class DivEditing extends BinFields {
    readonly divStore: DivStore;
    constructor(divStore: DivStore, binDiv: BinDiv, initBinRow?: BinRow) {
        super(divStore.entityBin, binDiv.buds, initBinRow);
        this.divStore = divStore;
        this.setNamedParams(divStore.namedResults);
    }
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing extends BinFields {
    constructor(bin: EntityBin, initValRow?: ValRow) {
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, props: budArr } = bin;
        let buds: BizBud[] = [];
        if (iBud !== undefined) buds.push(iBud);
        if (xBud !== undefined) buds.push(xBud);
        if (valueBud !== undefined) buds.push(valueBud);
        if (priceBud !== undefined) buds.push(priceBud);
        if (amountBud !== undefined) buds.push(amountBud);
        if (budArr !== undefined) buds.push(...budArr);
        super(bin, buds, initValRow);
    }
}
