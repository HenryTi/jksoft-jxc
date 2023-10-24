import { UqApp } from 'app/UqApp';
import { atom } from 'jotai';
import jsep from 'jsep';
import { setAtomValue } from 'tonwa-com';

enum CellType {
    value = 1,
    exp = 2,
}

export abstract class Cell {
    abstract get type(): CellType;
    readonly name: string;
    abstract get fixed(): boolean;
    value: number | string;
    constructor(name: string) {
        this.name = name;
    }
}

class ValueCell extends Cell {
    readonly type = CellType.value;
    readonly fixed = false;

    constructor(name: string, value: number | string) {
        super(name);
        this.value = value;
    }
}

class ExpCell extends Cell {
    readonly type = CellType.exp;
    readonly exp: jsep.Expression;
    readonly fixed: boolean;

    constructor(name: string, value: number, exp: jsep.Expression, fixed: boolean) {
        super(name);
        this.value = value;
        this.exp = exp;
        this.fixed = fixed;
    }
}

export class Calc {
    private readonly predefined: { [name: string]: any };
    private readonly cells: { [name: string]: Cell } = {};
    _hasValue = atom(false);

    constructor(predefined?: { [name: string]: any }) {
        this.predefined = predefined ?? undefined;
    }

    initCell(name: string, value: number | string, formula: string): Cell {
        let cell: Cell;
        if (formula === undefined) {
            cell = new ValueCell(name, value as number);
            this.cells[name] = cell;
        }
        else {
            let fixed = true;
            let p = formula.indexOf('\n');
            if (p > 0) {
                let suffix = formula.substring(p + 1);
                formula = formula.substring(0, p);
                switch (suffix) {
                    default: fixed = true; break;
                    case 'init': fixed = false; break;
                    case 'equ': fixed = true; break;
                }
            }
            let exp = jsep(formula);
            let v = value;
            if (v === undefined) {
                v = this.runExp(exp);
            }
            cell = new ExpCell(name, (value ?? v) as number, exp, fixed);
            this.cells[name] = cell;
        }
        return cell;
    }

    getCellValue(name: string) {
        return this.cells[name]?.value;
    }

    refreshHasValue() {
        let hasValue = true;
        for (let i in this.cells) {
            let cell = this.cells[i];
            if (cell.value === undefined) {
                hasValue = false;
                break;
            }
        }
        setAtomValue(this._hasValue, hasValue);
    }

    setCellValue(name: string, value: number, callback: (name: string, value: number) => void) {
        const c = this.cells[name];
        if (c === undefined) return;
        if (c.type !== CellType.value) return;
        c.value = value;
        for (let i in this.cells) {
            const cell = this.cells[i];
            if (cell.type === CellType.exp) {
                let value = cell.value = this.runExp((cell as ExpCell).exp);
                callback(cell.name, value);
            }
        }
    }

    private runExp(exp: jsep.Expression): number {
        switch (exp.type) {
            case 'BinaryExpression': return this.binary(exp as jsep.BinaryExpression);
            case 'Identifier': return this.identifier(exp as jsep.Identifier);
            case 'Literal': return this.literal(exp as jsep.Literal);
            case 'UnaryExpression': return this.unary(exp as jsep.UnaryExpression);
            case 'MemberExpression': return this.member(exp as jsep.MemberExpression);
        }
    }

    private binary(exp: jsep.BinaryExpression): number {
        const { operator, left, right } = exp;
        let vLeft = this.runExp(left);
        if (vLeft === undefined) return;
        let vRight = this.runExp(right);
        if (vRight === undefined) return;
        switch (operator) {
            default: return;
            case '-': return vLeft - vRight;
            case '+': return vLeft + vRight;
            case '*': return vLeft * vRight;
            case '/':
                if (vRight === 0) return;
                return vLeft / vRight;
        }
    }

    private unary(exp: jsep.UnaryExpression): number {
        const { operator, argument } = exp;
        let v = this.runExp(argument);
        switch (operator) {
            default: return;
            case '-': return -v;
            case '+': return v;
        }
    }

    private identifier(exp: jsep.Identifier): number {
        const { name } = exp;
        let cell = this.cells[name];
        if (cell === undefined) return;
        // if (cell.type !== CellType.value) return;
        return cell.value as number;
    }

    private member(exp: jsep.MemberExpression): number {
        const { object, property } = exp;
        let obj = this.runExp(object);
        let ret = this.predefined[obj];
        if (property === undefined) return ret;
        let p = this.runExp(property);
        return ret[p];
    }

    private literal(exp: jsep.Literal): number {
        return Number(exp.value);
    }
}
