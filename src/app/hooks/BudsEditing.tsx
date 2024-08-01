import { RegisterOptions } from "react-hook-form";
import { FormContext, FormRow } from "app/coms";
import {
    BizBud, BudID, BudDec, BudRadio, EnumBudType, ValueSetType, BudValuesTool,
    BudValuesToolBase,
    Biz
} from "app/Biz";
import { Calc, CalcIdObj, CalcResult, ValueSpace, Formula, Formulas } from "./Calc";
import { fromDays, getDays, Store } from "app/tool";
import { BudEditing, EditBudInline } from "app/hooks";
import { LabelBox } from "app/hooks/tool";
import { BudCheckValue, Modal } from "tonwa-app";
import { Atom } from "jotai";
import { ChangeEvent } from "react";
import dayjs from "dayjs";
// import { NamedResults } from "./Sheet/store";

export class BudsEditing<R = any> extends Store implements FormContext {
    private readonly calc: Calc;
    readonly valueSpace: ValueSpace;
    protected readonly requiredFields: BizBud[] = [];
    protected readonly budColl: { [name: string]: BizBud } = {};
    protected readonly buds: BizBud[];
    // readonly namedResults: NamedResults = {};
    readonly values: R = { buds: {} } as any;

    private budValuesTool: BudValuesToolBase<R>;
    // abstract get values(): R;
    protected stopRequired: boolean;

    constructor(modal: Modal, biz: Biz, buds: BizBud[]) {
        super(modal, biz);
        this.buds = buds;
        // this.calc = this.createCalc(formulas);
        let formulas = this.buildFormulas();
        this.valueSpace = new ValueSpace();
        this.calc = new Calc(this.valueSpace, formulas, this.values as any);
        // this.addFormulas();
    }

    /*
    constructor(modal: Modal, biz: Biz, buds: BizBud[]) {
        super(modal, biz, buds);
        this.budValuesTool = this.createBudValuesTool();
    }
    */
    private buildFormulas(): Formulas {
        const formulas: Formulas = [];
        if (this.buds === undefined) return formulas;
        for (let bud of this.buds) {
            let f = bud;
            const { name } = bud;
            let { required, valueSet, valueSetType } = bud;
            this.budColl[name] = f;
            let { ui, budDataType: { min, max } } = bud;
            if (ui?.show === true) continue;
            if (valueSet !== undefined) {
                formulas.push([name, valueSet]);
                if (valueSetType === ValueSetType.init) {
                    if (required === true) this.requiredFields.push(f);
                }
            }
            else {
                if (required === true) this.requiredFields.push(f);
            }
            if (min !== undefined) {
                formulas.push([name + '.min', min]);
            }
            if (max !== undefined) {
                formulas.push([name + '.max', max]);
            }
        }
        return formulas;
    }

    addFormula(name: string, formula: string) {
        this.calc.addFormula(name, formula);
    }

    addFormulas(formulas: [string, string][]) {
        this.calc.addFormulas(formulas);
    }

    getResults() { return this.calc.getResults(); }

    calcValue(formula: string): number | string {
        let ret = this.calc.calcFormula(formula);
        return ret;
    }

    /*
    setNamedResults(name: string, results: any) {
        this.namedResults[name] = results;
    }
    */

    setNamedValues(name: string, values: object) {
        // if (values === undefined) return;
        /*
        if (name === undefined) {
            Object.assign(this.namedResults, values);
        }
        else {
            this.namedResults[name] = values;
        }
        */
        this.calc.setValues(name, values);
    }

    clearNameValues(name: string) {
        // this.namedResults[name] = undefined;
        this.calc.setValue(name, undefined, undefined);
    }

    stopFormula(name: string) {
        this.calc.stopFormula(name);
    }

    getValue(name: string) {
        let ret = this.valueSpace.getValue(name);
        if (ret !== undefined) return ret;
        ret = this.calc.getValue(name);
        return ret;
    }

    getValueNumber(name: string) {
        let r = this.getValue(name);
        if (r === undefined || r === null) return r;
        if (typeof r === 'object') return (r as any).id;
        return r;
    }

    protected setBudValuesTool(budValuesTool: BudValuesToolBase<R>) {
        this.budValuesTool = budValuesTool;
    }

    protected setBudValue(bud: BizBud, value: any): void {
        this.setNamedValue(bud.name, value);
        this.budValuesTool.setBudValue(bud, this.values, value);
    }

    getBudValue(bud: BizBud): any {
        let ret = this.budValuesTool.getBudValue(bud, this.values);
        if (ret !== undefined) return ret;
        return this.calc.getValue(bud.name);
    }

    protected hasBud(bud: BizBud): boolean {
        return this.budValuesTool.has(bud);
    }

    protected getBuds(): BizBud[] {
        return this.budValuesTool.fields;
    }

    getTrigger(name: string): Atom<number> {
        throw new Error("Method not implemented.");
    }
    getParams(name: string): any {
        let allFields = this.allFields;
        let field = allFields.find(v => v.name === name);
        if (field === undefined) return;
        return { base: this.calcValue(field.atomParams?.base) }
    }

    setStopRequired() { this.stopRequired = true; }

    get allFields() { return this.budValuesTool.allFields; }
    get fields() { return this.budValuesTool.fields; }

    protected setBudObjectValue(bud: BizBud, valObj: object) { }

    calcAll() {
        let results = this.getResults();
        for (let i in this.budColl) {
            let field = this.budColl[i];
            if (i !== field.name) debugger;
            let result = results[i];
            if (result === undefined) {
                this.budValuesTool.clearValue(field, this.values);
            }
            else if (result === null || typeof result !== 'object') {
                this.budValuesTool.setBudValue(field, this.values, result);
            }
            else {
                let v = result.id;
                this.budValuesTool.setBudValue(field, this.values, v);
                this.setBudObjectValue(field, result);
            }
        }
    }

    addNamedParams(namedResults: ValueSpace) {
        if (namedResults === undefined) return;
        this.setNamedValues(undefined, namedResults.namedValues);
        this.calcAll();
    }

    // init formula only valid in init
    stopInitFormula() {
        for (let field of this.allFields) {
            if (field.valueSetType === ValueSetType.init) {
                this.stopFormula(field.name);
            }
        }
    }

    setNamedValue(name: string, value: number | string, callback?: (name: string, value: CalcResult) => void) {
        let c = (name: string, value: CalcResult) => {
            this.setFieldOrBudValue(name, value);
            if (callback !== undefined) {
                let field = this.budColl[name];
                // 针对 bud date，需要做days到DATE的转换
                // bud dec, 小数转换
                let uiValue = field.getUIValue(value);
                callback(name, uiValue);
            }
        }
        this.setFieldOrBudValue(name, value);
        // this.calc.setValue(name, value, callback);
        // c 的主要作用，是做了 value 转换。比如 计算的amount做了小数点转换
        // this.calc.setValue(name, value, c);
        this.calc.setValue(name, value, c);
    }

    private setFieldOrBudValue(name: string, value: CalcResult) {
        // console.log('setFieldOrBudValue name=', name, 'value=', value);
        let field = this.budColl[name];
        if (field === undefined) {
            return;
        }
        if (value === undefined) debugger;
        this.budValuesTool.setBudValue(field, this.values, value);
    }

    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = this.budValuesTool.getBudValue(field, this.values); // this.calc.results[field.name];
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
        this.setNamedValue(name, valueInput, (name, value) => {
            callback(name, value);
        });
    }

    isInputNeeded(): boolean {
        for (let field of this.allFields) {
            const bud = field;
            const { valueSetType } = bud;
            const { ui } = bud;
            if (ui?.show === true) continue;
            switch (valueSetType) {
                case ValueSetType.none: break;
                case ValueSetType.init: return true;
            }
        }
        return false;
    }

    getOnPick(bud: BizBud): (() => number | Promise<number>) {
        return undefined;
    }

    // bud.onForm===false
    buildFormRows(excludeOnFormFalse: boolean = false): FormRow[] {
        let ret: FormRow[] = [];
        const calcResults = this.getResults();
        for (let field of this.allFields) {
            const bud = field;
            const { name, onForm, required, valueSetType } = bud;
            if (excludeOnFormFalse === true) {
                if (onForm === false) continue;
            }
            /*
            为什么要屏蔽呢？应该要显示
            if ((this.budValuesTool.has(field) === true || this.budValuesTool.has(field) === true)
                && valueSetType === ValueSetType.equ
            ) {
                continue;
            }
            */
            const { caption, budDataType, ui } = bud;
            if (ui?.show === true) continue;
            let options: RegisterOptions = {
                value: this.budValuesTool.getBudValue(field, this.values),
                disabled: valueSetType === ValueSetType.equ,
                required,
            };
            let defaultValue = calcResults[name];
            let formRow: any = {
                name,
                label: caption ?? name,
                type: 'number',
                options,
                required,
                onPick: this.getOnPick(bud),
                default: defaultValue,
            };
            const { type, min, max } = budDataType;
            switch (type) {
                case EnumBudType.atom:
                    formRow.default = this.budValuesTool.getBudValue(field, this.values);
                    formRow.atom = null;
                    formRow.readOnly = true;
                    formRow.entityAtom = (budDataType as BudID).entityID;
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

    buildEditBuds() {
        let { fields } = this.budValuesTool;
        let budEditings = fields.map(v => new BudEditing(this, v));
        return budEditings.map(budEditing => {
            const { bizBud: bud } = budEditing;
            const { caption, name } = bud;
            let value = this.getBudValue(bud); // this.budValuesTool.getBudValue(bud, this.values);
            const onBudChanged = (bizBud: BizBud, newValue: string | number | BudCheckValue) => {
                this.setBudValue(bizBud, newValue);
            }
            const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
                let date = event.currentTarget.valueAsDate;
                let iso = date.toISOString();
                let p = iso.indexOf('T');
                let str = iso.substring(0, p);
                let n = getDays(str);
                this.setBudValue(bud, n);
            }
            return <LabelBox key={bud.id} label={caption ?? name} className="mb-2">
                <EditBudInline budEditing={budEditing} id={0} value={value} onChanged={onBudChanged} readOnly={false} options={{ onChange }} />
            </LabelBox>;
        })
    }

    createBudEditings() {
        let required: boolean;
        if (this.stopRequired) required = false;
        return this.buds.map(v => new BudEditing(this, v, required));
    }
}

export class ValuesBudsEditing extends BudsEditing<{ [id: number]: any }> {
    // readonly values: { [id: number]: any } = {};

    constructor(modal: Modal, biz: Biz, buds: BizBud[]/*, initValues?: any*/) {
        super(modal, biz, buds/*, initValues*/);
        /*
        if (initValues !== undefined) {
            //for (let bud of buds) this.budValuesTool.setBudValue(bud, this.values, initValues[bud.id]);
            for (let bud of buds) this.setBudValue(bud, initValues[bud.id]);
        }
        */
        this.setBudValuesTool(new BudValuesTool(this, buds));
    }

    initBudValues(initValues: any) {
        if (initValues === undefined) return;
        for (let bud of this.buds) this.setBudValue(bud, initValues[bud.id]);
    }

    /*
    protected createBudValuesTool(): BudValuesToolBase<{ [id: number]: any; }> {
        return new BudValuesTool(this, this.buds);
    }
    */
    /*
    protected setBudValue(bud: BizBud, value: any) {
        this.values[bud.id] = value;
    }
    */
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
