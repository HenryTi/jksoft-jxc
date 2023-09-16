import { ID } from "tonwa-uq";
import { EntityAtom } from ".";
import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";
import { EntityOptions } from './EntityOptions';

export abstract class BudDataType {
    abstract get type(): string;
    abstract get dataType(): 'string' | 'number';
    fromSchema(schema: any) { }
    scan(biz: Biz) { }
}

abstract class BudDataNumber extends BudDataType {
    readonly dataType = 'number';
}

abstract class BudDataString extends BudDataType {
    readonly dataType = 'string';
}

export class BudNone extends BudDataString {
    readonly type = 'none';
}
export class BudInt extends BudDataNumber {
    readonly type = 'int';
}
export class BudDec extends BudDataNumber {
    readonly type = 'dec';
}
export class BudString extends BudDataString {
    readonly type = 'str';
}
export class BudAtom extends BudDataNumber {
    readonly type = 'atom';
    private atom: string;
    bizAtom: EntityAtom;
    fromSchema(schema: any) {
        this.atom = schema.atom;
    }
    override scan(biz: Biz) {
        this.bizAtom = biz.entities[this.atom] as EntityAtom;
    }
}
export class BudID extends BudDataNumber {
    readonly type = 'ID';
    private IDName: string;
    ID: ID;
    fromSchema(schema: any) {
        this.IDName = schema.ID;
    }
    override scan(biz: Biz) {
        if (this.IDName !== undefined) {
            this.ID = (biz.uqApp.uq as any)[this.IDName] as ID;
        }
    }
}
abstract class BudOptions extends BudDataType {
    private optionsName: string;
    options: EntityOptions;
    get dataType(): 'string' | 'number' { return; }
    override scan(biz: Biz) {
        this.options = biz.entities[this.optionsName] as EntityOptions;
    }
    fromSchema(schema: any) {
        this.optionsName = schema.options;
    }
}
export class BudIntOf extends BudOptions {
    readonly type = 'intof';
}
export class BudRadio extends BudOptions {
    readonly type = 'radio';
}
export class BudCheck extends BudOptions {
    readonly type = 'check';
}
export class BudDate extends BudDataNumber {
    type = 'date';
}
export class BudDateTime extends BudDataNumber {
    type = 'datetime';
}

export class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budDataType: BudDataType;
    defaultValue: any;
    constructor(biz: Biz, name: string, dataType: string, entity: Entity) {
        super(biz, name, 'bud');
        this.entity = entity;
        let budDataType: BudDataType;
        switch (dataType) {
            case 'none': budDataType = new BudNone(); break;
            case 'int': budDataType = new BudInt(); break;
            case 'dec': budDataType = new BudDec(); break;
            case 'char':
            case 'str':
                budDataType = new BudString(); break;
            case 'atom':
                budDataType = new BudAtom(); break;
            case 'ID':
                budDataType = new BudID(); break;
            case 'intof': budDataType = new BudIntOf(); break;
            case 'radio': budDataType = new BudRadio(); break;
            case 'check': budDataType = new BudCheck(); break;
            case 'date': budDataType = new BudDate(); break;
            case 'datetime': budDataType = new BudDateTime(); break;
        }
        this.budDataType = budDataType;
    }
    /*
    get phrase(): string {
        return `${this.entity.phrase}.${this.name}`;
    }
    */
    scan() {
        this.budDataType.scan(this.biz);
    }

    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                super.fromSwitch(i, val);
                break;
            case 'items':
            case 'atom':
            case 'options':
                break;
            case 'value': this.defaultValue = val; break;
        }
    }
}
