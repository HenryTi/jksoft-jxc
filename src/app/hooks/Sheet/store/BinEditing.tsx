import { RegisterOptions } from "react-hook-form";
import { FormRow } from "app/coms";
import { BinDiv, BinField, BinRow, BizBud, BudAtom, BudDec, BudRadio, BudsFields, EntityBin, EnumBudType, ValueSetType } from "app/Biz";
import { Calc, Formulas } from "../../Calc";
import { ValRow } from "../tool";
import { DivStore, ValDiv } from ".";
import { NamedResults } from "./NamedResults";
import { getDays } from "app/tool";

export abstract class FieldsEditing extends BudsFields {
    private readonly calc: Calc;
    private readonly requiredFields: BinField[] = [];
    readonly valRow: ValRow = { buds: {} } as any;
    onDel: () => Promise<void>;

    constructor(bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        super(bin, buds);
        let requiredFields = this.requiredFields;
        const formulas: Formulas = [];
        for (let i in this.fieldColl) {
            let f = this.fieldColl[i];
            let { name, bud, valueSet, valueSetType, required } = f;
            if (name !== i) {
                this.fieldColl[name] = f;
            }
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
        if (namedResults === undefined) return;
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
        for (let field of this.allFields) {
            if (field.valueSetType === ValueSetType.init) {
                this.calc.stopFormula(field.name);
            }
        }
    }

    setValue(name: string, value: number | string, callback: (name: string, value: string | number) => void) {
        const c = (name: string, value: string | number) => {
            this.setFieldOrBudValue(name, value);
            if (callback !== undefined) {
                let field = this.fieldColl[name];
                // 针对 bud date，需要做days到DATE的转换
                let uiValue = field.getValue(this.valRow);
                callback(name, uiValue);
            }
        }
        this.setFieldOrBudValue(name, value);
        this.calc.setValue(name, value, c);
    }

    private setFieldOrBudValue(name: string, value: number | string) {
        console.log('setFieldOrBudValue name=', name, 'value=', value);
        let field = this.fieldColl[name];
        if (field === undefined) {
            return;
        }
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

    onChange(name: string, type: 'text' | 'number' | 'radio' | 'date', valueInputText: string
        , callback: (name: string, value: string | number) => void) {
        let valueInput: any;
        if (valueInputText.trim().length === 0) {
            valueInput = undefined;
        }
        else {
            switch (type) {
                default: debugger; break;
                case 'date':
                    valueInput = getDays(valueInputText);
                    break;
                case 'number':
                    let v = Number(valueInputText);
                    valueInput = Number.isNaN(v) === true ? undefined : v;
                    break;
                case 'text':
                    valueInput = valueInputText;
                    break;
                case 'radio':
                    valueInput = Number(valueInputText);
                    break;
            }
        }
        this.setValue(name, valueInput, (name, value) => {
            callback(name, value);
        });
    }

    get results() { return this.calc.results; }

    isInputNeeded(): boolean {
        for (let field of this.allFields) {
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
    /*
    getDefaultValue(field: BinField): number {
        return field.getValue(this.valRow);
    }
    */
    buildFormRows(filterOnForm: boolean = false): FormRow[] {
        let ret: FormRow[] = [];
        const { results: calcResults } = this.calc;
        for (let field of this.allFields) {
            const { name, bud, valueSetType, required, onForm } = field;
            if (filterOnForm === true) {
                if (onForm === false) continue;
            }
            const { caption, budDataType, ui } = bud;
            let { show } = ui;
            if (show === true) continue;
            let options: RegisterOptions = {
                value: field.getValue(this.valRow), // this.getDefaultValue(field),
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
                    formRow.entityAtom = (budDataType as BudAtom).bizAtom;
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
                case EnumBudType.date:
                    formRow.type = 'date';
                    break;
                case EnumBudType.datetime:
                    debugger;
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

export class DivEditing extends FieldsEditing {
    readonly divStore: DivStore;
    // readonly pendLeft: number;
    constructor(divStore: DivStore, namedResults: NamedResults, binDiv: BinDiv, valDiv: ValDiv, initBinRow?: BinRow) {
        super(divStore.entityBin, binDiv.buds, initBinRow);
        this.divStore = divStore;
        this.setNamedParams(namedResults);
        // this.pendLeft = 
        if (this.fieldValue !== undefined) {
            let pendLeft = divStore.getPendLeft(valDiv);
            if (pendLeft !== undefined) {
                this.fieldValue.setValue(this.valRow, pendLeft);
            }
        }
    }
    /*
    get pendLeft() {
        return this.divStore.getPendLeft();
    }
    */
    /*
    getDefaultValue(field: BinField): number {
        if (field.name === 'value') {
            if (this.pendLeft !== undefined) {
                return this.pendLeft;
            }
        }
        return field.getValue(this.valRow);
    }
    */
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing extends FieldsEditing {
    constructor(bin: EntityBin, initValRow?: ValRow) {
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, buds: budArr } = bin;
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
