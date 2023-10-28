import jsep from 'jsep';

export interface NameValues {
    identifier(name: string): string | number;
    member(name0: string, name1: string): string | number;
}

export class PickedNameValues implements NameValues {
    private readonly values: any;
    constructor(values: any) {
        if (values === null || typeof values !== 'object') debugger;
        this.values = values;
    }
    identifier(name: string): string | number {
        let ret = this.values[name];
        if (typeof ret === 'object') {
            return ret.id;
        }
        return ret;
    }
    member(name0: string, name1: string): string | number {
        let obj = this.values[name0];
        if (typeof obj !== 'object') return;
        let ret = obj[name1];
        if (typeof ret === 'object') return ret.id;
        return ret;
    }
}

export class Formula {
    private readonly exp: jsep.Expression;
    readonly once: boolean;
    constructor(formula: string) {
        let p = formula.indexOf('\n');
        if (p > 0) {
            let suffix = formula.substring(p + 1);
            formula = formula.substring(0, p);
            this.once = suffix === 'init';
        }
        else {
            this.once = false;
        }
        this.exp = jsep(formula);
    }

    run(nameValues: NameValues) {
        return this.runExp(this.exp, nameValues);
    }

    private runExp(exp: jsep.Expression, nameValues: NameValues): string | number {
        switch (exp.type) {
            case 'BinaryExpression': return this.binary(exp as jsep.BinaryExpression, nameValues);
            case 'Identifier': return this.identifier(exp as jsep.Identifier, nameValues);
            case 'Literal': return this.literal(exp as jsep.Literal);
            case 'UnaryExpression': return this.unary(exp as jsep.UnaryExpression, nameValues);
            case 'MemberExpression': return this.member(exp as jsep.MemberExpression, nameValues);
        }
    }

    private binary(exp: jsep.BinaryExpression, nameValues: NameValues): number {
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

    private unary(exp: jsep.UnaryExpression, nameValues: NameValues): number {
        const { operator, argument } = exp;
        let v = this.runExp(argument, nameValues) as number;
        switch (operator) {
            default: return;
            case '-': return -v;
            case '+': return v;
        }
    }

    private identifier(exp: jsep.Identifier, nameValues: NameValues): number {
        const { name } = exp;
        return nameValues.identifier(name) as number;
    }

    private member(exp: jsep.MemberExpression, nameValues: NameValues): number {
        const { object, property } = exp;
        let { type, name: objName } = object as jsep.Identifier;
        if (type !== property.type && type !== 'Identifier') debugger;
        let { name: propName } = property as jsep.Identifier;
        return nameValues.member(objName, propName) as number;
    }

    private literal(exp: jsep.Literal): number {
        return Number(exp.value);
    }
}

export interface Formulas { [name: string]: string; };
export class Calc implements NameValues {
    private readonly formulas: { [name: string]: Formula } = {};
    readonly values: { [name: string]: string | number };

    constructor(formulas: Formulas, valuesStore?: { [name: string]: string | number }) {
        for (let i in formulas) {
            let f = formulas[i];
            if (f === undefined) continue;
            let formula = new Formula(f);
            this.formulas[i] = formula;
        }
        this.values = valuesStore ?? {};
    }

    init(picked: { [name: string]: any }) {
        let nameValues = new PickedNameValues(picked);
        console.log('after let nameValues = new PickedNameValues(picked);');
        for (let i in this.formulas) {
            this.values[i] = this.formulas[i].run(nameValues);
        }
    }

    setValues(values: any) {
        Object.assign(this.values, values);
    }

    immutable(name: string) {
        let f = this.formulas[name];
        if (f === undefined) return false;
        return f.once === false;
    }

    private run(callback: (name: string, value: string | number) => void) {
        for (let i in this.formulas) {
            let formula = this.formulas[i];
            if (formula.once === true) continue;
            try {
                let ret = formula.run(this);
                if (ret === undefined) continue;
                this.values[i] = ret;
                callback(i, ret);
            }
            catch {
            }
        }
    }

    setValue(name: string, value: number | string, callback: (name: string, value: string | number) => void) {
        this.values[name] = value;
        this.run(callback);
    }

    identifier(name: string): string | number {
        return this.values[name];
    }
    member(name0: string, name1: string): string | number {
        throw new Error();
    }
}
