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
    value: number;
    constructor(name: string) {
        this.name = name;
    }
}

class ValueCell extends Cell {
    readonly type = CellType.value;
    readonly fixed = false;

    constructor(name: string, value: number) {
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
    private readonly uqApp: UqApp
    private cells: { [name: string]: Cell } = {};
    _hasValue = atom(false);

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
    }

    initCell(name: string, value: number, formula: string): Cell {
        let cell: Cell;
        if (formula === undefined) {
            cell = new ValueCell(name, value);
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
            cell = new ExpCell(name, value, exp, fixed);
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

    async setCellValue(name: string, value: number, callback: (name: string, value: number) => void) {
        const c = this.cells[name];
        if (c === undefined) return;
        if (c.type !== CellType.value) return;
        c.value = value;
        for (let i in this.cells) {
            const cell = this.cells[i];
            if (cell.type === CellType.exp) {
                let value = cell.value = await this.runExp((cell as ExpCell).exp);
                callback(cell.name, value);
            }
        }
    }

    private async runExp(exp: jsep.Expression): Promise<number> {
        switch (exp.type) {
            case 'BinaryExpression': return await this.binary(exp as jsep.BinaryExpression);
            case 'Identifier': return await this.identifier(exp as jsep.Identifier);
            case 'Literal': return await this.literal(exp as jsep.Literal);
            case 'UnaryExpression': return await this.unary(exp as jsep.UnaryExpression);
        }
    }

    private async binary(exp: jsep.BinaryExpression): Promise<number> {
        const { operator, left, right } = exp;
        let vLeft = await this.runExp(left);
        if (vLeft === undefined) return;
        let vRight = await this.runExp(right);
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

    private async unary(exp: jsep.UnaryExpression): Promise<number> {
        const { operator, argument } = exp;
        let v = await this.runExp(argument);
        switch (operator) {
            default: return;
            case '-': return -v;
            case '+': return v;
        }
    }

    private async identifier(exp: jsep.Identifier): Promise<number> {
        const { name } = exp;
        let cell = this.cells[name];
        if (cell === undefined) return;
        if (cell.type !== CellType.value) return;
        return cell.value;
    }

    private async literal(exp: jsep.Literal): Promise<number> {
        return Number(exp.value);
    }
}
