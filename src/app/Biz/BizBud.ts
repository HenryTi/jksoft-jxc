import { EntityAtom } from ".";
import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";

export abstract class BudDataType {
    type: string;
    fromSchema(schema: any) { }
    scan(biz: Biz) { }
}
export class BudInt extends BudDataType {
    type = 'int';
}
export class BudDec extends BudDataType {
    type = 'dec';
}
export class BudString extends BudDataType {
    type = 'str';
}
export class BudAtom extends BudDataType {
    type = 'atom';
    private atom: string;
    bizAtom: EntityAtom;
    fromSchema(schema: any) {
        this.atom = schema.atom;
    }
    override scan(biz: Biz) {
        this.bizAtom = biz.entities[this.atom] as EntityAtom;
    }
}
abstract class BudTypeWithItems extends BudDataType {
    items: any[] = [];
    override fromSchema(schema: any) {
        super.fromSchema(schema);
        this.items = schema.items;
    }
}
export class BudRadio extends BudTypeWithItems {
    type = 'radio';
}
export class BudCheck extends BudDataType {
    type = 'check';
}
export class BudDate extends BudDataType {
    type = 'date';
}
export class BudDateTime extends BudDataType {
    type = 'datetime';
}

export abstract class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budDataType: BudDataType;
    defaultValue: any;
    constructor(biz: Biz, name: string, dataType: string, entity: Entity) {
        super(biz, name, 'bud');
        this.entity = entity;
        let budDataType: BudDataType;
        switch (dataType) {
            case 'int': budDataType = new BudInt(); break;
            case 'dec': budDataType = new BudDec(); break;
            case 'char':
            case 'str':
                budDataType = new BudString(); break;
            case 'atom':
            case 'ID':
                budDataType = new BudAtom(); break;
            case 'radio': budDataType = new BudRadio(); break;
            case 'check': budDataType = new BudCheck(); break;
            case 'date': budDataType = new BudDate(); break;
            case 'datetime': budDataType = new BudDateTime(); break;
        }
        this.budDataType = budDataType;
    }

    get phrase(): string {
        return `${this.entity.phrase}.${this.name}`;
    }

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
                break;
            case 'value': this.defaultValue = val; break;
        }
    }
}

export class BizProp extends BizBud {
    // readonly budType = BudType.prop;
}

export class BizAssign extends BizBud {
    // readonly budType = BudType.assign;
}
