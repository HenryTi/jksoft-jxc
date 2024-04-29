import { RegisterOptions } from "react-hook-form";
import { FormRow } from "app/coms";
import {
    BinRow, BizBud, BudAtom, BudDec, BudRadio
    , EntityBin, EnumBudType, ValueSetType,
    BinValues
} from "app/Biz";
import { Calc, CalcResult, Formulas } from "../../Calc";
import { DivStore } from "./DivStore";
import { SheetStore } from "./SheetStore";
import { ValDivBase } from "./ValDiv";
import { NamedResults } from "./NamedResults";
import { getDays } from "app/tool";
import { ValRow } from "./tool";

export abstract class FieldsEditing /*extends BinBudsFields */ {
    private readonly calc: Calc;
    private readonly requiredFields: BizBud[] = [];

    readonly entityBin: EntityBin;
    readonly fieldColl: { [name: string]: BizBud } = {};

    readonly valRow: ValRow = { buds: {} } as any;
    readonly sheetStore: SheetStore;
    readonly binValues: BinValues;
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;
    onDel: () => Promise<void>;

    constructor(sheetStore: SheetStore, bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        // super(bin, buds);
        this.sheetStore = sheetStore;
        let requiredFields = this.requiredFields;
        this.binValues = new BinValues(bin, buds);
        // this.allFields = buds;
        // this.fields = bin.buds;
        const formulas: Formulas = [];
        for (let i in this.fieldColl) {
            let f = this.fieldColl[i];
            // let { name, bud } = f;
            let bud = f;
            const { name } = bud;
            let { required, valueSet, valueSetType } = bud;
            if (name !== i) {
                this.fieldColl[name] = f;
            }
            let { ui, budDataType: { min, max } } = bud;
            if (ui?.show === true) continue;
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

    get allFields() { return this.binValues.allFields; }

    setNamedParams(namedResults: { [name: string]: any }) {
        if (namedResults === undefined) return;
        this.calc.addValues(undefined, namedResults);
        const { results } = this.calc;
        for (let i in this.fieldColl) {
            let field = this.fieldColl[i];
            if (i !== field.name) debugger;
            let result = results[i];
            if (result === null || typeof result !== 'object') {
                this.binValues.setBudValue(field, this.valRow, result);
            }
            else {
                let v = result.id;
                this.binValues.setBudValue(field, this.valRow, v);
                switch (i) {
                    case 'i': this.iValue = result.id; this.iBase = result.base; break;
                    case 'x': this.xValue = result.id; this.xBase = result.base; break;
                }
            }
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
            //if (field.bud.valueSetType === ValueSetType.init) {
            if (field.valueSetType === ValueSetType.init) {
                this.calc.stopFormula(field.name);
            }
        }
    }

    setValue(name: string, value: number | string, callback: (name: string, value: CalcResult) => void) {
        let c = (name: string, value: CalcResult) => {
            this.setFieldOrBudValue(name, value);
            if (callback !== undefined) {
                let field = this.fieldColl[name];
                // 针对 bud date，需要做days到DATE的转换
                // bud dec, 小数转换
                let uiValue = field.getUIValue(value);
                callback(name, uiValue);
            }
        }
        this.setFieldOrBudValue(name, value);
        // this.calc.setValue(name, value, callback);
        // c 的主要作用，是做了 value 转换。比如 计算的amount做了小数点转换
        this.calc.setValue(name, value, c);
    }

    private setFieldOrBudValue(name: string, value: CalcResult) {
        // console.log('setFieldOrBudValue name=', name, 'value=', value);
        let field = this.fieldColl[name];
        if (field === undefined) {
            return;
        }
        this.binValues.setBudValue(field, this.valRow, value);
    }

    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = this.binValues.getBudValue(field, this.valRow); // this.calc.results[field.name];
            if (v === undefined) {
                return false;
            }
        }
        return ret;
    }

    onChange(name: string, type: 'text' | 'number' | 'radio' | 'date' | 'select-one', valueInputText: string
        , callback: (name: string, value: CalcResult) => void) {
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
                case 'select-one':
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
            //const { bud } = field;
            const bud = field;
            const { valueSetType } = bud;
            const { ui } = bud;
            if (ui?.show === true) continue;
            switch (valueSetType) {
                case ValueSetType.none:
                case ValueSetType.init: return true;
            }
        }
        return false;
    }
    buildFormRows(filterOnForm: boolean = false): FormRow[] {
        let ret: FormRow[] = [];
        const { results: calcResults } = this.calc;
        for (let field of this.allFields) {
            //const { name, bud } = field;
            const bud = field;
            const { name, onForm, required } = bud;
            if (filterOnForm === true) {
                if (onForm === false) continue;
            }
            const { valueSetType } = bud;
            //if ((field === this.fieldI || field === this.fieldX) 
            if ((this.binValues.has(field) === true || this.binValues.has(field) === true)
                && valueSetType === ValueSetType.equ) {
                continue;
            }
            const { caption, budDataType, ui } = bud;
            if (ui?.show === true) continue;
            let options: RegisterOptions = {
                value: this.binValues.getBudValue(field, this.valRow), // this.getDefaultValue(field),
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
                    formRow.default = this.binValues.getBudValue(field, this.valRow);
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
                    }
                    formRow.step = step;
                    formRow.options.valueAsNumber = true;
                    if (min !== undefined) {
                        formRow.options.min = calcResults[`${name}.min`];
                    }
                    if (max !== undefined) {
                        formRow.options.max = calcResults[`${name}.max`];
                    }
                    break;
                case EnumBudType.radio:
                    let radioItems = budRadios(budDataType as BudRadio);
                    switch (ui?.edit) {
                        case 'pop':
                        case 'dropdown':
                        default: formRow.items = radioItems; break;
                        case 'radio': formRow.radios = radioItems; break;
                    }
                    // 从数据库getsheet返回的是array
                    let optionsValue = options.value;
                    if (Array.isArray(optionsValue) === true) {
                        options.value = optionsValue[0];
                    }
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
    readonly valDiv: ValDivBase;
    // readonly val0Div: ValDivBase;          // 0 层的valDiv
    //constructor(divStore: DivStore, namedResults: NamedResults, binDiv: BinDiv, valDiv: ValDivBase, initBinRow?: BinRow) {
    constructor(divStore: DivStore, valDiv: ValDivBase, namedResults?: NamedResults) {
        const { binDiv, valRow } = valDiv;
        super(divStore.sheetStore, divStore.entityBin, binDiv.buds, valRow);
        this.divStore = divStore;
        this.valDiv = valDiv;
        this.setNamedParams(namedResults);
        this.setValueDefault(valDiv);
    }

    private setValueDefault(valDiv: ValDivBase) {
        const { value } = this.entityBin;
        if (value === undefined) return;
        if (this.binValues.getBudValue(value, this.valRow) !== undefined) return;
        let pendLeft = this.divStore.getPendLeft(valDiv);
        if (pendLeft === undefined) return;
        this.binValues.setBudValue(value, this.valRow, pendLeft);
    }
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing extends FieldsEditing {
    constructor(sheetStore: SheetStore, bin: EntityBin, initValRow?: ValRow) {
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, buds: budArr } = bin;
        let buds: BizBud[] = [];
        if (iBud !== undefined) buds.push(iBud);
        if (xBud !== undefined) buds.push(xBud);
        if (valueBud !== undefined) buds.push(valueBud);
        if (priceBud !== undefined) buds.push(priceBud);
        if (amountBud !== undefined) buds.push(amountBud);
        if (budArr !== undefined) buds.push(...budArr);
        super(sheetStore, bin, buds, initValRow);
    }
}
