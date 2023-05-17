import { EntityAtom } from ".";
import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";

export abstract class BudType {
    type: string;
    fromSchema(schema: any) { }
    scan(biz: Biz) { }
}
export class BudInt extends BudType {
    type = 'int';
}
export class BudDec extends BudType {
    type = 'dec';
}
export class BudString extends BudType {
    type = 'str';
}
export class BudAtom extends BudType {
    type = 'atom';
    private atom: string;
    bizAtom: EntityAtom;
    fromSchema(schema: any) {
        this.atom = schema.atom;
    }
    override scan(biz: Biz) {
        this.bizAtom = biz.atoms[this.atom];
    }
}
abstract class BudTypeWithItems extends BudType {
    items: any[] = [];
    override fromSchema(schema: any) {
        super.fromSchema(schema);
        this.items = schema.items;
    }
}
export class BudRadio extends BudTypeWithItems {
    type = 'radio';
}
export class BudCheck extends BudType {
    type = 'check';
}
export class BudDate extends BudType {
    type = 'date';
}
export class BudDateTime extends BudType {
    type = 'datetime';
}

export abstract class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budType: BudType;
    defaultValue: any;
    constructor(biz: Biz, name: string, type: string, entity: Entity) {
        super(biz, name, 'bud');
        this.entity = entity;
        let budType: BudType;
        switch (type) {
            case 'int': budType = new BudInt(); break;
            case 'dec': budType = new BudDec(); break;
            case 'char':
            case 'str':
                budType = new BudString(); break;
            case 'atom':
            case 'ID':
                budType = new BudAtom(); break;
            case 'radio': budType = new BudRadio(); break;
            case 'check': budType = new BudCheck(); break;
            case 'date': budType = new BudDate(); break;
            case 'datetime': budType = new BudDateTime(); break;
        }
        this.budType = budType;
    }

    get phrase(): string {
        return `${this.entity.phrase}.${this.name}`;
    }

    scan() {
        this.budType.scan(this.biz);
    }

    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                super.fromSwitch(i, val);
                break;
            case 'items':
            case 'atom':
                break;
            case 'value': this.defaultValue = val; break;
        }
    }
}

export class BizProp extends BizBud {
}

export class BizAssign extends BizBud {
}
