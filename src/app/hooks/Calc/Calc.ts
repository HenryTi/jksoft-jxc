import { getDays } from 'app/tool';
import jsep from 'jsep';
import { ValueSpace } from './ValueSpace';
import dayjs from 'dayjs';

jsep.addIdentifierChar("%");
export class Formula {
    private readonly exp: jsep.Expression;
    constructor(formula: string) {
        this.exp = jsep(formula);
    }

    run(nameValues: ValueSpace) {
        return this.runExp(this.exp, nameValues);
    }

    private runExp(exp: jsep.Expression, nameValues: ValueSpace): CalcResult {
        switch (exp.type) {
            case 'CallExpression': return this.func(exp as jsep.CallExpression, nameValues);
            case 'BinaryExpression': return this.binary(exp as jsep.BinaryExpression, nameValues);
            case 'Identifier': return this.identifier(exp as jsep.Identifier, nameValues);
            case 'Literal': return this.literal(exp as jsep.Literal);
            case 'UnaryExpression': return this.unary(exp as jsep.UnaryExpression, nameValues);
            case 'MemberExpression': return this.member(exp as jsep.MemberExpression, nameValues);
        }
    }

    private binary(exp: jsep.BinaryExpression, nameValues: ValueSpace): number {
        const { operator, left, right } = exp;
        let vLeft = this.runExp(left, nameValues) as number;
        if (vLeft === undefined) return;
        let vRight = this.runExp(right, nameValues) as number;
        if (vRight === undefined) return;
        switch (operator) {
            default: return;
            case '-': return vLeft as number - vRight;
            case '+': return vLeft as number + vRight;
            case '*': return vLeft * vRight;
            case '/':
                if (vRight === 0) return;
                return vLeft / vRight;
        }
    }

    private unary(exp: jsep.UnaryExpression, nameValues: ValueSpace): number {
        const { operator, argument } = exp;
        let v = this.runExp(argument, nameValues) as number;
        switch (operator) {
            default: return;
            case '-': return -v;
            case '+': return v;
        }
    }

    private identifier(exp: jsep.Identifier, nameValues: ValueSpace): CalcIdObj {
        const { name } = exp;
        return nameValues.identifier(name) as number;
    }

    private member(exp: jsep.MemberExpression, nameValues: ValueSpace): CalcIdObj {
        const { object, property } = exp;
        let { type, name: objName } = object as jsep.Identifier;
        if (type !== property.type && type !== 'Identifier') debugger;
        let { name: propName } = property as jsep.Identifier;
        return nameValues.member(objName, propName) as number;
    }

    private literal(exp: jsep.Literal): number | string {
        let { value } = exp;
        let ret = Number(value);
        return Number.isNaN(ret) === true ? String(value) : ret;
    }

    private func(exp: jsep.CallExpression, nameValues: ValueSpace): number {
        let func = (exp.callee as jsep.Identifier).name.toLowerCase();
        let params = exp.arguments.map(v => this.runExp(v, nameValues));
        let ret = funcs[func]?.(...params);
        return ret;
    }
}

const funcs: { [func: string]: (...params: any[]) => number } = {
    curdate: function () {
        let d = dayjs(new Date()).format('YYYY-MM-DD');
        let ret = getDays(d);
        return ret;
    }
}

export type Formulas = [string, string][];
export type CalcIdObj = number | { id: number; base?: number; };
export type CalcResult = number | string | CalcIdObj;
export class Calc {
    private readonly calcSpace: ValueSpace;
    private readonly formulas: Map<string, Formula>;
    private _results: { [name: string]: CalcResult; };

    constructor(calcSpace: ValueSpace, formulas: [string, string][], values?: any) {
        this.formulas = new Map();
        this.addFormulas(formulas);
        this.calcSpace = calcSpace; //  new CalcSpace();
        this.calcSpace.addValues(undefined, values);
    }

    addFormula(name: string, formulaText: string) {
        this._results = undefined;
        let formula = new Formula(formulaText);
        this.formulas.set(name, formula);
    }

    addFormulas(formulas: [string, string][]) {
        for (let [name, formulaText] of formulas) {
            if (formulaText === undefined) continue;
            this.addFormula(name, formulaText);
        }
    }

    getResults(): { [name: string]: CalcResult } {
        if (this._results === undefined) {
            this.run(undefined);
        }
        return this._results;
    }

    calcFormula(formula: string): string | number {
        if (formula === undefined) return undefined;
        this._results = undefined;
        let name = '$_$';
        let fm = new Formula(formula);
        this.formulas.set(name, fm);
        let ret = this.getValue(name);
        this.formulas.delete(name);
        return ret;
    }

    getValue(name: string): string | number {
        if (this._results === undefined) {
            this.run(undefined);
        }
        let v = this._results[name];
        if (typeof v === 'object') {
            if (v !== null) return v.id;
        }
        return v as number | string;
    }

    stopFormula(name: string) {
        this.formulas.delete(name);
    }

    setValues(name: string, values: any): void {
        this.calcSpace.addValues(name, values);
        this._results = undefined;
    }

    private run(callback: (name: string, value: CalcResult) => void) {
        if (this._results === undefined) this._results = {};
        for (let [name, formula] of this.formulas) {
            try {
                let ret = formula.run(this.calcSpace);
                if (ret === undefined) continue;
                this._results[name] = ret;
                this.calcSpace.setValue(name, ret as any);
                if (callback !== undefined) {
                    callback(name, typeof ret === 'object' ? ret.id : ret);
                }
            }
            catch {
            }
        }
    }

    setValue(name: string, value: number | string, callback: (name: string, value: CalcResult) => void) {
        this.calcSpace.setValue(name, value as number);
        this.run(callback);
    }
}
