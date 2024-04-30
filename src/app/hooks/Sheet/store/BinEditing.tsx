import { RegisterOptions } from "react-hook-form";
import { FormRow } from "app/coms";
import {
    BinRow, BizBud, BudAtom, BudDec, BudRadio
    , EntityBin, EnumBudType, ValueSetType,
    BinRowValues,
    BudValues,
    BudValuesBase
} from "app/Biz";
import { Calc, CalcResult, Formulas } from "../../Calc";
import { DivStore } from "./DivStore";
import { SheetStore } from "./SheetStore";
import { ValDivBase } from "./ValDiv";
import { NamedResults } from "./NamedResults";
import { getDays } from "app/tool";
import { ValRow } from "./tool";
import { BudEditing, EditBudInline, ViewBud, ViewBudUIType } from "app/hooks";
import { AtomColl, LabelBox } from "app/hooks/tool";
import { EditBudAtom } from "app/hooks/Bud/Edit/EditBudAtom";

export abstract class BudsEditingBase<R, B extends BudValuesBase<R>> /*extends BinBudsFields */ {
    private readonly requiredFields: BizBud[] = [];
    protected readonly calc: Calc;
    protected budValues: B;
    readonly namedBuds: { [name: string]: BizBud } = {};
    protected readonly formulas: Formulas;
    abstract get values(): R;

    constructor(buds: BizBud[], initBinRow?: any) {
        // super(bin, buds);
        let requiredFields = this.requiredFields;
        // this.allFields = buds;
        // this.fields = bin.buds;
        const formulas: Formulas = [];
        this.formulas = formulas;
        for (let bud of buds) {
            // let f = f  this.fieldColl[i];
            // let { name, bud } = f;
            let f = bud;
            const { name } = bud;
            let { required, valueSet, valueSetType } = bud;
            this.namedBuds[name] = f;
            /*
            if (name !== i) {
                this.fieldColl[name] = f;
            }
            */
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
        this.calc = this.createCalc();
    }

    protected abstract createCalc(): Calc;

    get allFields() { return this.budValues.allFields; }

    setNamedParams(namedResults: { [name: string]: any }) {
        if (namedResults === undefined) return;
        this.calc.addValues(undefined, namedResults);
        const { results } = this.calc;
        for (let i in this.namedBuds) {
            let field = this.namedBuds[i];
            if (i !== field.name) debugger;
            let result = results[i];
            if (result === null || typeof result !== 'object') {
                this.budValues.setBudValue(field, this.values, result);
            }
            else {
                let v = result.id;
                this.budValues.setBudValue(field, this.values, v);
                this.setBudObjectValue(field, result);
            }
        }
    }

    protected setBudObjectValue(bud: BizBud, valObj: object) { }

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
                let field = this.namedBuds[name];
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
        let field = this.namedBuds[name];
        if (field === undefined) {
            return;
        }
        this.budValues.setBudValue(field, this.values, value);
    }

    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = this.budValues.getBudValue(field, this.values); // this.calc.results[field.name];
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

    // bud.onForm===false
    buildFormRows(excludeOnFormFalse: boolean = false): FormRow[] {
        let ret: FormRow[] = [];
        const { results: calcResults } = this.calc;
        for (let field of this.allFields) {
            //const { name, bud } = field;
            const bud = field;
            const { name, onForm, required } = bud;
            if (excludeOnFormFalse === true) {
                if (onForm === false) continue;
            }
            const { valueSetType } = bud;
            //if ((field === this.fieldI || field === this.fieldX) 
            if ((this.budValues.has(field) === true || this.budValues.has(field) === true)
                && valueSetType === ValueSetType.equ) {
                continue;
            }
            const { caption, budDataType, ui } = bud;
            if (ui?.show === true) continue;
            let options: RegisterOptions = {
                value: this.budValues.getBudValue(field, this.values), // this.getDefaultValue(field),
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
                    formRow.default = this.budValues.getBudValue(field, this.values);
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

    buildViewBuds(bizAtomColl: AtomColl) {
        return this.budValues.fields.map(field => {
            // const { bud } = field;
            const bud = field;
            const { id } = bud;
            let value = this.budValues.getBudValue(field, this.values);
            if (value === null || value === undefined) return null;
            return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} atomColl={bizAtomColl} />;
        })
    }

    buildEditBuds() {
        let { fields } = this.budValues;
        let budEditings = fields.map(v => new BudEditing(v));
        return budEditings.map(field => {
            const { bizBud: bud } = field;
            const { caption, name } = bud;
            let value = this.budValues.getBudValue(bud, this.values);
            function onBudChanged() {
                alert('changed');
            }
            return <LabelBox key={bud.id} label={caption ?? name} className="mb-2">
                <EditBudInline budEditing={field} id={0} value={value} onChanged={onBudChanged} readOnly={false} />
            </LabelBox>;
            // return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} atomColl={bizAtomColl} />;
        })
    }
}

export class BudsEditing extends BudsEditingBase<any, BudValues> {
    readonly values: any = {} as any;

    constructor(buds: BizBud[], initValues?: any) {
        super(buds, initValues);
        this.budValues = new BudValues(buds);
    }

    protected createCalc(): Calc {
        return new Calc(this.formulas, this.values as any);
    }
}

export abstract class BinBudsEditing extends BudsEditingBase<BinRow, BinRowValues> {
    readonly values: ValRow = { buds: {} } as any;
    readonly entityBin: EntityBin;
    readonly sheetStore: SheetStore;
    // protected binRowValues: BinRowValues;
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;
    onDel: () => Promise<void>;

    constructor(sheetStore: SheetStore, bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        super(buds, initBinRow);
        this.sheetStore = sheetStore;
        this.entityBin = bin;
        this.budValues = new BinRowValues(bin, buds);
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    protected createCalc(): Calc {
        return new Calc(this.formulas, this.values as any);
    }

    private setValues(binRow: BinRow) {
        Object.assign(this.values, binRow);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.calc.addValues(undefined, obj);
    }

    protected override setBudObjectValue(bud: BizBud, result: { id: number; base: number; }) {
        switch (bud.name) {
            case 'i': this.iValue = result.id; this.iBase = result.base; break;
            case 'x': this.xValue = result.id; this.xBase = result.base; break;
        }
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

export class DivEditing extends BinBudsEditing {
    readonly divStore: DivStore;
    readonly valDiv: ValDivBase;
    constructor(divStore: DivStore, valDiv: ValDivBase, namedResults?: NamedResults) {
        const { binDiv, valRow } = valDiv;
        super(divStore.sheetStore, divStore.entityBin, binDiv.buds, valRow);
        this.divStore = divStore;
        this.valDiv = valDiv;
        this.setNamedParams(namedResults);
        this.setValueDefault(valDiv);
    }

    private setValueDefault(valDiv: ValDivBase) {
        const { budValue } = this.budValues;
        if (budValue === undefined) return;
        if (this.budValues.getBudValue(budValue, this.values) !== undefined) return;
        let pendLeft = this.divStore.getPendLeft(valDiv);
        if (pendLeft === undefined) return;
        this.budValues.setBudValue(budValue, this.values, pendLeft);
    }
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing extends BinBudsEditing {
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
