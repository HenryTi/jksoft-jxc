import { BizAtom } from ".";
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
    bizAtom: BizAtom;
    fromSchema(schema: any) {
        this.atom = schema.atom;
    }
    override scan(biz: Biz) {
        this.bizAtom = biz.atoms[this.atom];
    }
}
export class BudRadio extends BudType {
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
}

export class BizProp extends BizBud {
}

export class BizAssign extends BizBud {
}
