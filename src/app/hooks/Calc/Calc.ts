import { getDays } from 'app/tool';
import jsep from 'jsep';
import { CalcSpace } from './CalcSpace';

export enum FormulaSetType {
    init,
    equ,
    show,
}
export class Formula {
    private readonly exp: jsep.Expression;
    readonly setType: FormulaSetType;
    constructor(formula: string) {
        let p = formula.indexOf('\n');
        if (p > 0) {
            let suffix = formula.substring(p + 1);
            formula = formula.substring(0, p);
            this.setType = FormulaSetType[suffix as keyof typeof FormulaSetType];
        }
        else {
            this.setType = FormulaSetType.equ;
        }
        this.exp = jsep(formula);
    }

    run(nameValues: CalcSpace) {
        return this.runExp(this.exp, nameValues);
    }

    private runExp(exp: jsep.Expression, nameValues: CalcSpace): string | number {
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

    private identifier(exp: jsep.Identifier, nameValues: CalcSpace): number {
        const { name } = exp;
        return nameValues.identifier(name) as number;
    }

    private member(exp: jsep.MemberExpression, nameValues: CalcSpace): number {
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

export interface Formulas { [name: string]: string; };
export class Calc {
    private readonly calcSpace: CalcSpace;
    private readonly formulas: { [name: string]: Formula } = {};
    private _results: { [name: string]: string | number };

    constructor(formulas: Formulas, values?: { [name: string]: string | number | { [prop: string]: string | number } }) {
        for (let i in formulas) {
            let f = formulas[i];
            if (f === undefined) continue;
            let formula = new Formula(f);
            this.formulas[i] = formula;
        }
        this.calcSpace = new CalcSpace();
        this.calcSpace.addValues(undefined, values);
    }

    get results(): { [name: string]: string | number } {
        if (this._results === undefined) {
            this.calc();
        }
        return this._results;
    }

    addValues(name: string, values: object): void {
        this.calcSpace.addValues(name, values);
        this._results = undefined;
    }

    private calc() {
        if (this._results === undefined) this._results = {};
        for (let i in this.formulas) {
            let ret = this.formulas[i].run(this.calcSpace);
            this._results[i] = ret;
        }
    }

    formulaSetType(name: string) {
        let f = this.formulas[name];
        if (f === undefined) return false;
        return f.setType;
    }

    private run(callback: (name: string, value: string | number) => void) {
        for (let i in this.formulas) {
            let formula = this.formulas[i];
            if (formula.setType !== FormulaSetType.equ) continue;
            try {
                let ret = formula.run(this.calcSpace);
                if (ret === undefined) continue;
                this.results[i] = ret;
                callback(i, ret);
            }
            catch {
            }
        }
    }

    setValue(name: string, value: number | string, callback: (name: string, value: string | number) => void) {
        // this.results[name] = value;
        this.calcSpace.setValue(name, value as number);
        this.run(callback);
    }
    /*
    identifier(name: string): string | number {
        return this.results[name];
    }
    member(name0: string, name1: string): string | number {
        throw new Error();
    }
    */
}
