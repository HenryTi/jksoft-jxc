import { ID } from "tonwa-uq";
import { EntityAtom, EntityPick } from ".";
import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";
import { EntityOptions } from './EntityOptions';
import { BizPhraseType } from "uqs/UqDefault";

export enum EnumBudType {
    none = 0,
    int = 11,                   // bigint
    atom = 12,                  // atom id
    radio = 13,                 // single radio ids
    check = 14,                 // multiple checks
    intof = 15,
    pick = 18,
    ID = 19,

    dec = 21,                   // dec(18.6)

    char = 31,                  // varchar(100)
    str = 32,                   // varchar(100)

    date = 41,
    datetime = 42,
};

export abstract class BudDataType {
    abstract get type(): EnumBudType;
    abstract get dataType(): string;
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
    readonly type = EnumBudType.none;
}
export class BudInt extends BudDataNumber {
    readonly type = EnumBudType.int;
}
export class BudDec extends BudDataNumber {
    readonly type = EnumBudType.dec;
}
export class BudString extends BudDataString {
    readonly type = EnumBudType.str;
}
export class BudAtom extends BudDataNumber {
    readonly type = EnumBudType.atom;
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
    readonly type = EnumBudType.ID;
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
    readonly type = EnumBudType.intof;
}
export class BudRadio extends BudOptions {
    readonly type = EnumBudType.radio;
}
export class BudCheck extends BudOptions {
    readonly type = EnumBudType.check;
}
export class BudDate extends BudDataNumber {
    type = EnumBudType.date;
}
export class BudDateTime extends BudDataNumber {
    type = EnumBudType.datetime;
}

export class BudPickable extends BudDataNumber {
    readonly type = EnumBudType.pick;
    private schema: any;
    atom: EntityAtom;
    pick: EntityPick;
    value: string;
    fromSchema(schema: any) {
        this.schema = schema;
    }
    override scan(biz: Biz) {
        const { entities } = biz;
        const { pick } = this.schema;
        if (pick !== undefined) {
            const pickEntity = entities[pick];
            switch (pickEntity.type) {
                case 'atom': this.atom = pickEntity as EntityAtom; break;
                case 'pick': this.pick = pickEntity as EntityPick; break;
            }
        }
        this.schema = undefined;
    }
}

export class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budDataType: BudDataType;
    defaultValue: any;
    ex: any;
    constructor(biz: Biz, id: number, name: string, dataType: EnumBudType, entity: Entity) {
        super(biz, id, name, 'bud');
        this.entity = entity;
        let budDataType: BudDataType;
        switch (dataType) {
            case EnumBudType.none: budDataType = new BudNone(); break;
            case EnumBudType.int: budDataType = new BudInt(); break;
            case EnumBudType.dec: budDataType = new BudDec(); break;
            case EnumBudType.char:
            case EnumBudType.str:
                budDataType = new BudString(); break;
            case EnumBudType.atom:
                budDataType = new BudAtom(); break;
            case EnumBudType.ID:
                budDataType = new BudID(); break;
            case EnumBudType.pick:
                budDataType = new BudPickable(); break;
            case EnumBudType.intof: budDataType = new BudIntOf(); break;
            case EnumBudType.radio: budDataType = new BudRadio(); break;
            case EnumBudType.check: budDataType = new BudCheck(); break;
            case EnumBudType.date: budDataType = new BudDate(); break;
            case EnumBudType.datetime: budDataType = new BudDateTime(); break;
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
            case 'ex': this.ex = val; break;
            case 'items':
            case 'atom':
            case 'options':
                break;
            case 'value': this.defaultValue = val; break;
        }
    }
}
