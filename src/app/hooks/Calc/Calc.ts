import { getDays } from 'app/tool';
import jsep from 'jsep';
import { CalcSpace } from './CalcSpace';

export class Formula {
    private readonly exp: jsep.Expression;
    constructor(formula: string) {
        this.exp = jsep(formula);
    }

    run(nameValues: CalcSpace) {
        return this.runExp(this.exp, nameValues);
    }

    private runExp(exp: jsep.Expression, nameValues: CalcSpace): CalcResult {
        switch (exp.type) {
            case 'CallExpression': return this.func(exp as jsep.CallExpression, nameValues);
            case 'BinaryExpression': return this.binary(exp as jsep.BinaryExpression, nameValues);
            case 'Identifier': return this.identifier(exp as jsep.Identifier, nameValues);
            case 'Literal': return this.literal(exp as jsep.Literal);
            case 'UnaryExpression': return this.unary(exp as jsep.UnaryExpression, nameValues);
            case 'MemberExpression': return this.member(exp as jsep.MemberExpression, nameValues);
        }
    }

    private binary(exp: jsep.BinaryExpression, nameValues: CalcSpace): number {
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

    private unary(exp: jsep.UnaryExpression, nameValues: CalcSpace): number {
        const { operator, argument } = exp;
        let v = this.runExp(argument, nameValues) as number;
        switch (operator) {
            default: return;
            case '-': return -v;
            case '+': return v;
        }
    }

    private identifier(exp: jsep.Identifier, nameValues: CalcSpace): CalcIdObj {
        const { name } = exp;
        return nameValues.identifier(name) as number;
    }

    private member(exp: jsep.MemberExpression, nameValues: CalcSpace): CalcIdObj {
        const { object, property } = exp;
        let { type, name: objName } = object as jsep.Identifier;
        if (type !== property.type && type !== 'Identifier') debugger;
        let { name: propName } = property as jsep.Identifier;
        return nameValues.member(objName, propName) as number;
    }

    private literal(exp: jsep.Literal): number {
        return Number(exp.value);
    }

    private func(exp: jsep.CallExpression, nameValues: CalcSpace): number {
        let func = (exp.callee as jsep.Identifier).name.toLowerCase();
        let params = exp.arguments.map(v => this.runExp(v, nameValues));
        let ret = funcs[func]?.(...params);
        return ret;
    }
}

const funcs: { [func: string]: (...params: any[]) => number } = {
    curdate: function () {
        return getDays(new Date().toISOString());
    }
}

export type Formulas = [string, string][];
export type CalcIdObj = number | { id: number; base?: number; };
export type CalcResult = number | string | CalcIdObj;
export class Calc {
    private readonly calcSpace: CalcSpace;
    private readonly formulas: Map<string, Formula>;
    private _results: { [name: string]: CalcResult; };

    constructor(formulas: [string, string][], values?: { [name: string]: string | number | { [prop: string]: CalcResult; } }) {
        this.formulas = new Map();
        for (let [name, formulaText] of formulas) {
            if (formulaText === undefined) continue;
            let formula = new Formula(formulaText);
            this.formulas.set(name, formula);
        }
        this.calcSpace = new CalcSpace();
        this.calcSpace.addValues(undefined, values);
    }

    get results(): { [name: string]: CalcResult } {
        if (this._results === undefined) {
            this.run(undefined);
        }
        return this._results;
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

    addValues(name: string, values: object): void {
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
