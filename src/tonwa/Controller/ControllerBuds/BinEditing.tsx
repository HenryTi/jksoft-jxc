import { ChangeEvent } from "react";
import { RegisterOptions } from "react-hook-form";
import { Atom, atom, WritableAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import {
    BinRow, BizBud, EntityBin, BinRowValuesTool,
    ValueSetType,
    BudValuesToolBase,
    BinPick,
    PickAtom,
    PickSpec,
    PickQuery,
    PickPend,
    Entity,
    PickOptions,
    EnumBudType,
    BudID,
    BudFork,
    BudDec,
    BudRadio,
    BizPhraseType,
    Biz,
    BudValuesTool
} from "../../Biz";
import { StoreBase, StoreEntity, BinStore, StoreSheet, BudCheckValue, PickResult, RearPickResultType } from "../../Store";
import { ValDivBase } from "../../Store/ValDiv";
import { ValRow } from "../../Store/ValRow";
// import { BudEditing, Calc, CalcResult, EditBudInline, Formulas, ValueSpace, ViewBud, ViewBudUIType } from "app/hooks";
// import { FormContext, FormRow } from "app/coms";
import { Modal } from "../../UI";
import { getDays } from "../../tools";
import { BudEditing, EditBudInline, LabelBox, ViewBud, ViewBudUIType } from "../../View";
import { Calc, CalcResult, Formulas, ValueSpace } from "../../Calc";
import { FormContext, FormRow } from "../../View/Form";
// import { LabelBox } from "app/hooks/tool";

// import { pickFromAtom } from "app/hooks/Sheet/binPick/pickFromAtom";
// import { pickFromSpec } from "app/hooks/Sheet/binPick/pickFromSpec";
// import { pickFromQuery, pickFromQueryScalar } from "app/hooks/Query";
// import { pickFromOptions } from "app/hooks/Sheet/binPick/pickFromOptions";
// import { RearPickResultType, PickResult } from "./PickResult";
// import { pickFromPend } from "app/hooks/Sheet/binPick/pickFromPend";
/*
import { BizPhraseType } from "uqs/UqDefault";
import { pickFromAtom } from "../binPick/pickFromAtom";
import { pickFromSpec } from "../binPick/pickFromSpec";
import { pickFromQuery, pickFromQueryScalar } from "app/hooks/Query";
import { pickFromPend } from "../binPick/pickFromPend";
import { pickFromOptions } from "../binPick/pickFromOptions";
*/
// import { SheetEditing } from "../binPick";

export class FormBudsStore extends StoreBase implements FormContext {
    readonly budsEditing: BudsEditing;
    constructor(modal: Modal, budsEditing: BudsEditing) {
        super(modal, budsEditing.biz);
        this.budsEditing = budsEditing;
    }
    getTrigger(name: string): Atom<number> {
        return this.budsEditing.getTrigger(name);
    }
    getParams(name: string) {
        return this.budsEditing.getParams(name);
    }
    getValue(name: string) {
        return this.budsEditing.getValue(name);
    }
    getBudValue(bud: BizBud) {
        return this.budsEditing.getBudValue(bud);
    }
    getEntityFromId(id: number): Entity {
        return this.budsEditing.getEntityFromId(id);
    }
    getEntity(entityId: number): Entity {
        return this.budsEditing.getEntity(entityId);
    }
    setBudValue(bud: BizBud, value: any): void {
        this.budsEditing.setBudValue(bud, value);
    }
    get store(): StoreEntity<Entity> { return this.budsEditing.store; }
    calcValue(formula: string): number | string | object {
        return this.budsEditing.calcValue(formula);
    }
    getPick(bud: BizBud): BinPick {
        return this.budsEditing.getPick(bud);
    }
    addFormula(name: string, formula: string, initOnly: boolean) {
        this.budsEditing.addFormula(name, formula, initOnly)
    }
    getBudsNameValues() {
        return this.budsEditing.getBudsNameValues();
    }
    clearNameValues(name: string) {
        this.budsEditing.clearNameValues(name);
    }
    setNamedValue(name: string, value: number | string, callback?: (bud: BizBud, value: CalcResult) => void) {
        this.budsEditing.setNamedValue(name, value, callback);
    }
    // bud.onForm===false
    buildFormRows(excludeOnForm: boolean = false): FormRow[] {
        let ret: FormRow[] = [];
        const calcResults = this.budsEditing.getResults();
        for (let bud of this.budsEditing.allFields) {
            const { name, onForm, required, valueSetType } = bud;
            if (excludeOnForm === true) {
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
            let defaultValue = this.budsEditing.getBudValue(bud);
            let readOnly = valueSetType === ValueSetType.equ;
            let options: RegisterOptions = {
                value: typeof defaultValue === 'object' ? JSON.stringify(defaultValue) : defaultValue,
                disabled: readOnly,
                required,
            };
            let formRow: any = {
                name,
                label: caption,
                type: 'number',
                options,
                required,
                // onPick: this.getOnPick(bud),
                default: defaultValue,
            };
            const { type, min, max } = budDataType;
            const { budValuesTool, values } = this.budsEditing;
            switch (type) {
                case EnumBudType.bin:
                    formRow.default = budValuesTool.getBudValue(bud, values);
                    formRow.bud = bud;
                    break;
                case EnumBudType.atom:
                    formRow.default = budValuesTool.getBudValue(bud, values);
                    formRow.readOnly = readOnly;
                    formRow.entityAtom = (budDataType as BudID).entityID;
                    formRow.bud = bud;
                    break;
                case EnumBudType.fork:
                    const { base: baseBud } = budDataType as BudFork;
                    formRow.baseBud = baseBud === undefined ? null : baseBud;
                    formRow.readOnly = readOnly;
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

    private budEditings: BudEditing[];
    buildEditBuds() {
        let { fields } = this.budsEditing.budValuesTool;
        this.budEditings = fields.map(v => new BudEditing(this.budsEditing, v));
        return this.budEditings.map(budEditing => {
            const { bizBud: bud } = budEditing;
            const { caption } = bud;
            let value = this.budsEditing.getBudValue(bud);
            const onBudChanged = (bizBud: BizBud, newValue: string | number | BudCheckValue) => {
                this.budsEditing.setBudValue(bizBud, newValue);
            }
            const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
                if (bud.budDataType.type !== EnumBudType.date) return;
                let date = event.currentTarget.valueAsDate;
                let iso = date.toISOString();
                let p = iso.indexOf('T');
                let str = iso.substring(0, p);
                let n = getDays(str);
                this.budsEditing.setBudValue(bud, n);
            }
            return <LabelBox key={bud.id} label={caption} className="mb-2">
                <EditBudInline formBudsStore={this} budEditing={budEditing} id={0} value={value} onChanged={onBudChanged} readOnly={false} options={{ onChange }} />
            </LabelBox>;
        })
    }

    async runBinPick1(binPick: BinPick) {
        const { name, fromPhraseType } = binPick;
        if (fromPhraseType === undefined) return; // break;
        let pickResult: PickResult = await this.switchPhraseType(binPick);
        if (pickResult === undefined) return;
        this.budsEditing.setNamedValues(name, pickResult);
        return pickResult;
    }

    private async switchPhraseType(pick: BinPick) {
        let pickResult: PickResult;
        switch (pick.fromPhraseType) {
            default: break;
            case BizPhraseType.atom:
                // pickResult = await pickFromAtom(this, pick as PickAtom);
                break;
            case BizPhraseType.fork:
                // pickResult = await pickFromSpec(this, pick as PickSpec);
                break;
            case BizPhraseType.query:
                // pickResult = await pickFromQueryScalar(this, pick as PickQuery);
                break;
            case BizPhraseType.options:
                // pickResult = await pickFromOptions(this.modal, pick as PickOptions);
                break;
        }
        return pickResult;
    }

    async runBinPickRear(binStore: BinStore, rearPick: BinPick, rearPickResultType: RearPickResultType) {
        const { fromPhraseType } = rearPick;
        switch (fromPhraseType) {
            default: break;
            case BizPhraseType.query:
                if (rearPickResultType === RearPickResultType.array) {
                    return; // await pickFromQuery(this, rearPick as PickQuery, rearPickResultType);
                }
                break;
            case BizPhraseType.pend:
                return; // await pickFromPend(binStore, this, rearPick as PickPend);
        }
        let pickResult = await this.switchPhraseType(rearPick);
        if (pickResult !== undefined) return pickResult;
    }

    setNamedValues(name: string, values: object) {
        this.budsEditing.setNamedValues(name, values);
    }

    initBudValues(initValues: any) {
        this.budsEditing.initBudValues(initValues);
    }
}

export abstract class BudsEditing<R = any> {
    readonly biz: Biz;
    private readonly calc: Calc;
    readonly valueSpace: ValueSpace;
    protected readonly requiredFields: BizBud[] = [];
    protected readonly budColl: { [name: string | number]: BizBud } = {};
    protected readonly buds: BizBud[];
    readonly values: R = { buds: {} } as any;

    budValuesTool: BudValuesToolBase<R>;
    protected stopRequired: boolean;

    constructor(/*modal: Modal, biz: Biz, */biz: Biz, buds: BizBud[]) {
        // super(modal, biz);
        this.biz = biz;
        this.buds = buds ?? [];
        let formulas = this.buildFormulas();
        this.valueSpace = new ValueSpace(biz);
        this.calc = new Calc(this.valueSpace, formulas, this.values as any);
    }
    initBudValues(initValues: any) { }
    abstract get atomChanging(): WritableAtom<any, any, any>;
    setChanging() { }
    private buildFormulas(): Formulas {
        const formulas: Formulas = [];
        if (this.buds === undefined) return formulas;
        for (let bud of this.buds) {
            let f = bud;
            const { id, name, required, valueSet, valueSetType } = bud;
            this.budColl[name] = f;
            this.budColl[id] = f;
            let { ui, budDataType: { min, max } } = bud;
            if (ui?.show === true) continue;
            if (valueSet !== undefined) {
                let initOnly: boolean;
                if (valueSetType === ValueSetType.init) {
                    initOnly = true;
                    if (required === true) this.requiredFields.push(f);
                }
                formulas.push([name, valueSet, initOnly]);
            }
            else {
                if (required === true) this.requiredFields.push(f);
            }
            if (min !== undefined) {
                formulas.push([name + '.min', min, undefined]);
            }
            if (max !== undefined) {
                formulas.push([name + '.max', max, undefined]);
            }
        }
        return formulas;
    }

    addFormula(name: string, formula: string, initOnly: boolean) {
        this.calc.addFormula(name, formula, initOnly);
    }

    addFormulas(formulas: [string, string, boolean][]) {
        this.calc.addFormulas(formulas);
    }

    getResults() { return this.calc.getResults(); }

    calcValue(formula: string): number | string | object {
        let ret = this.calc.calcFormula(formula);
        return ret;
    }

    get store(): StoreEntity { return undefined; }

    getNameValues(name: string) {
        return this.calc.getValues(name);
    }

    setNamedValues(name: string, values: object) {
        this.calc.setValues(name, values);
    }

    clearNameValues(name: string) {
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
        this.calcAll();
    }

    setBudValue(bud: BizBud, value: any): void {
        this.setNamedValue(bud.name, value);
        this.budValuesTool.setBudValue(bud, this.values, value);
    }

    getBudValue(bud: BizBud): any {
        let ret = this.budValuesTool.getBudValue(bud, this.values);
        if (ret !== undefined) return ret;
        return this.calc.getValue(bud.name);
    }

    getEntityFromId(id: number): Entity { return undefined; }
    getEntity(entityId: number): Entity { return this.biz.entityFromId(entityId); }

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

    getResultObject(): any {
        let ret: any = {};
        for (let f of this.allFields) {
            ret[f.id] = this.getBudValue(f);
        }
        return ret;
    }

    setStopRequired() { this.stopRequired = true; }

    get allFields() { return this.budValuesTool.allFields; }
    get fields() { return this.budValuesTool.fields; }

    protected setBudObjectValue(bud: BizBud, valObj: object) { }

    calcAll() {
        let results = this.getResults();
        for (let i in this.budColl) {
            let field = this.budColl[i];
            if (i !== field.name) continue;
            let result = results[i];
            if (result === undefined) {
                this.budValuesTool.clearValue(field, this.values);
            }
            else if (result === null || typeof result !== 'object') {
                this.budValuesTool.setBudValue(field, this.values, result);
            }
            else {
                let v = result.id;
                // 这一句处理Fork字段，是一个json结构
                if (v === undefined) v = result as any;
                this.budValuesTool.setBudValue(field, this.values, v);
                this.setBudObjectValue(field, result);
            }
        }
        this.initEmptyForkBuds();
    }

    private initEmptyForkBuds() {
        for (const bud of this.buds) {
            const { budDataType } = bud;
            if (budDataType.type !== EnumBudType.fork) continue;
            let forkValue = this.getBudValue(bud);
            if (forkValue === undefined) this.initEmptyForkBud(bud, budDataType as BudFork);
        }
    }

    private initEmptyForkBud(bud: BizBud, budFork: BudFork) {
        const { base } = budFork;
        if (base === undefined) return;
        let baseId = this.getBudValue(base);
        if (baseId === undefined) return;
        const atom = this.store.getCacheAtom(baseId);
        if (atom === undefined) return;
        let { fork } = atom.entityID;
        if (fork === undefined) return;
        let forkValue = { "$": fork.id };
        this.setBudValue(bud, forkValue);
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

    setNamedValue(name: string, value: number | string, callback?: (bud: BizBud, value: CalcResult) => void) {
        let c = (name: string, value: CalcResult) => {
            let bud = this.budColl[name];
            this.setFieldOrBudValue(bud, value);
            if (callback !== undefined) {
                // let field = this.budColl[name];
                // 针对 bud date，需要做days到DATE的转换
                // bud dec, 小数转换
                let uiValue = bud.getUIValue(value);
                callback(bud, uiValue);
            }
        }
        // this.setFieldOrBudValue(bud, value);
        // this.calc.setValue(name, value, callback);
        // c 的主要作用，是做了 value 转换。比如 计算的amount做了小数点转换
        // this.calc.setValue(name, value, c);
        let bud = this.budColl[name];
        this.setFieldOrBudValue(bud, value);
        this.calc.setValue(name, value, c);
    }

    recalcNamedValues(name: string, value: number | string, callback?: (bud: BizBud, value: CalcResult) => void) {
        let c = (name: string, value: CalcResult) => {
            let bud = this.budColl[name];
            this.setFieldOrBudValue(bud, value);
            if (callback !== undefined) {
                // let field = this.budColl[name];
                // 针对 bud date，需要做days到DATE的转换
                // bud dec, 小数转换
                let uiValue = bud.getUIValue(value);
                callback(bud, uiValue);
            }
        }
        let bud = this.budColl[name];
        this.setFieldOrBudValue(bud, value);
        // this.calc.setValue(name, value, callback);
        // c 的主要作用，是做了 value 转换。比如 计算的amount做了小数点转换
        // this.calc.setValue(name, value, c);
        this.calc.setValueAndRecalcNotInitOnly(name, value, c);
    }

    private setFieldOrBudValue(bud: BizBud, value: CalcResult) {
        if (bud === undefined) return;
        this.budValuesTool.setBudValue(bud, this.values, value);
    }

    submitable(): boolean {
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
        , callback: (bud: BizBud, value: CalcResult) => void) {
        let valueInput: any;
        if (typeof valueInput === 'string' && valueInputText.trim().length === 0) {
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
        if (valueInput === undefined) valueInput = null;
        this.recalcNamedValues(name, valueInput, (bud, value) => {
            callback(bud, value);
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
    /*
    getOnPick(bud: BizBud): (() => number | Promise<number>) {
        return undefined;
    }
    */
    getPick(bud: BizBud): BinPick { return undefined; }

    buildCalcBuds() {
        for (let bud of this.allFields) {
            const { valueSetType } = bud;
            if (valueSetType === ValueSetType.equ || valueSetType === ValueSetType.init) {
                let value = this.getBudValue(bud);
                if (value === undefined) continue;
                this.budValuesTool.setBudValue(bud, this.values, value);
            }
        }
    }

    createBudEditings() {
        let required: boolean;
        if (this.stopRequired) required = false;
        return this.buds.map(v => new BudEditing(this, v, required));
    }

    getBudsNameValues() {
        let ret: any = {};
        for (let i in this.values) {
            let bud = this.budColl[i];
            if (bud === undefined) continue;
            ret[bud.name] = this.values[i];
        }
        return ret;
    }

    async getBudsIdValues() {
        return this.values;
    }
}

export class ValuesBudsEditing extends BudsEditing<{ [id: number]: any }> {
    constructor(biz: Biz, buds: BizBud[]) {
        super(biz, buds);
        this.setBudValuesTool(new BudValuesTool(/*this, */buds));
    }

    get atomChanging(): WritableAtom<any, any, any> { return undefined; }

    initBudValues(initValues: any) {
        if (initValues === undefined) return;
        for (let bud of this.buds) this.setBudValue(bud, initValues[bud.id]);
    }

    initNameValues(initValues: any) {
        if (initValues === undefined) return;
        for (let bud of this.buds) this.setBudValue(bud, initValues[bud.name]);
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

export class BinBudsEditing extends BudsEditing<ValRow> {
    // readonly values: ValRow = { buds: {} } as any;
    readonly atomChanging = atom(0);
    readonly entityBin: EntityBin;
    readonly sheetStore: StoreSheet;
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;
    onDel: () => Promise<void>;

    constructor(sheetStore: StoreSheet, bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        super(sheetStore.biz, buds);
        this.sheetStore = sheetStore;
        this.entityBin = bin;
        this.setBudValuesTool(new BinRowValuesTool(/*this, */bin, buds));
        const { userProxy, mainProxy } = sheetStore;
        this.setNamedValues(undefined, {
            'user': userProxy,
            '%user': userProxy,
            '%sheet': mainProxy,
        });
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    get store() { return this.sheetStore; }

    getEntityFromId(id: number): Entity {
        const ret = this.sheetStore.getCacheAtom(id);
        if (ret === undefined) {
            debugger;
            return;
        }
        const { entityID } = ret;
        return entityID;
    }

    protected createBudValuesTool(): BudValuesToolBase<ValRow> {
        return new BinRowValuesTool(/*this, */this.entityBin, this.buds);
    }

    private setValues(binRow: BinRow) {
        Object.assign(this.values, binRow);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.setNamedValues(undefined, obj);
    }

    protected override setBudObjectValue(bud: BizBud, result: { id: number; base: number; }) {
        switch (bud.name) {
            case 'i': this.iValue = result.id; this.iBase = result.base; break;
            case 'x': this.xValue = result.id; this.xBase = result.base; break;
        }
    }
    /*
    buildShowBuds(excludeBuds?: { [id: number]: boolean }): any[] {
        let ret: any[] = [];
        for (let field of this.fields) {
            const bud = field;
            const { valueSetType } = bud;
            // if (this.budValuesTool.has(field) !== true || valueSetType !== ValueSetType.equ) continue;
            if (this.hasBud(field) !== true || valueSetType !== ValueSetType.equ) continue;
            const { id } = bud;
            if (excludeBuds !== undefined) {
                if (excludeBuds[id] === true) continue;
            }
            // let value = this.budValuesTool.getBudValue(field, this.values);
            let value = this.getBudValue(field);
            if (value === null || value === undefined) continue;
            ret.push(<ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} store={this.sheetStore} />);
        }
        return ret;
    }
    */
    override setChanging() {
        setAtomValue(this.atomChanging, getAtomValue(this.atomChanging) + 1);
    }

    getPick(bud: BizBud) {
        let { onPicks } = this.entityBin;
        let pick = onPicks[bud.id];
        return pick;
    }
}

export class DivEditing extends BinBudsEditing {
    readonly binStore: BinStore;
    readonly valDiv: ValDivBase;
    constructor(binStore: BinStore, valDiv: ValDivBase, namedResults?: any) {
        const { binDiv, valRow } = valDiv;
        const { sheetStore, entity } = binStore;
        super(sheetStore, entity, binDiv.buds, valRow);
        this.binStore = binStore;
        this.valDiv = valDiv;
        // 这里先强行设iBase和xBase from pend
        this.initNamedResults(namedResults);
        this.setValueDefault(valDiv);
    }

    setPendResult(pendResult: object) {
        if (pendResult === undefined) return;
        this.setNamedValues('pend', pendResult);
        this.setNamedValues('%pend', pendResult);
        let pendValues = this.getNameValues('pend') as any; // namedResults['pend'];
        if (pendValues === undefined) return;
        let { i, x, iBase, xBase } = pendValues;
        this.iValue = i;
        this.xValue = x;
        if (this.iBase === undefined) {
            if (iBase === undefined) {
                let specValues = this.getNameValues('spec') as any; // namedResults['spec'];
                if (specValues !== undefined) {
                    iBase = specValues.base;
                }
            }
            this.iBase = iBase;
        }
        this.xBase = xBase;
    }

    private initNamedResults(namedResults: any) {
        if (namedResults === undefined) return;
        this.addNamedParams(namedResults);
        this.setPendResult(namedResults);
    }

    private setValueDefault(valDiv: ValDivBase) {
        const { value: budValue } = this.entityBin;
        if (budValue === undefined) return;
        if (this.hasBud(budValue) === false) return;
        if (this.getBudValue(budValue) !== undefined) return;
        let pendLeft = this.binStore.getPendLeft(valDiv);
        if (pendLeft === undefined) return;
        this.setBudValue(budValue, pendLeft);
    }

    buildViewBuds() {
        let buds = this.getBuds();
        return buds.map(bud => {
            const { id } = bud;
            let value = this.getBudValue(bud);
            if (value === null || value === undefined) return null;
            return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} store={this.sheetStore} />;
        })
    }
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing extends BinBudsEditing {
    constructor(sheetStore: StoreSheet, bin: EntityBin, initValRow?: ValRow) {
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
