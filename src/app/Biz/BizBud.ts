import { ID } from "tonwa-uq";
import { EntityAtom, EntityPick } from "./EntityAtom";
import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";
import { EntityOptions } from './EntityOptions';
import { contentFromDays } from "app/tool";

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

    arr = 99,
};

export abstract class BudDataType {
    abstract get type(): EnumBudType;
    abstract get dataType(): string;
    min: string;
    max: string;
    fromSchema(schema: any) {
        this.min = schema.min;
        this.max = schema.max;
    }
    scan(biz: Biz, bud: BizBud) { }
    valueToContent(value: string | number) {
        return value;
    }
    /*
    fromSwitch(entity: Entity, i: string, val: any) {
        switch (i) {
            case 'min': this.min = val; break;
            case 'max': this.max = val; break;
        }
    }
    */
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
export class BudArr extends BudDataString {
    readonly type = EnumBudType.arr;
    buds: BizBud[];
    private props: any;
    override fromSchema(schema: any): void {
        this.props = schema.props;
    }
    scan(biz: Biz, bud: BizBud) {
        this.buds = bud.entity.fromProps(this.props);
        for (let bud of this.buds) {
            bud.scan();
        }
        this.props = undefined;
    }
    /*
    override fromSwitch(entity: Entity, i: string, val: any) {
        switch (i) {
            case 'props':
                this.buds = entity.fromProps(val);
                break;
        }
    }
    */
}
export class BudInt extends BudDataNumber {
    readonly type = EnumBudType.int;
}
export class BudDec extends BudDataNumber {
    readonly type = EnumBudType.dec;
    fraction: number;
    override scan(biz: Biz, bud: BizBud) {
        const { ui } = bud;
        if (ui !== undefined) {
            this.fraction = ui.fraction;
        }
    }
    valueToContent(value: number) {
        if (this.fraction === undefined) return value;
        if (value === undefined) return;
        return value.toFixed(this.fraction);
    }
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
    override scan(biz: Biz, bud: BizBud) {
        this.bizAtom = biz.entities[this.atom] as EntityAtom;
    }
}
/*
export class BudID extends BudDataNumber {
    readonly type = EnumBudType.ID;
    private IDName: string;
    ID: ID;
    fromSchema(schema: any) {
        this.IDName = schema.ID;
    }
    override scan(biz: Biz, bud: BizBud) {
        if (this.IDName !== undefined) {
            this.ID = (biz.uqApp.uq as any)[this.IDName] as ID;
        }
    }
}
*/
export class BudIDIO extends BudDataNumber {
    readonly type = EnumBudType.ID;
    private atom: number;
    bizAtom: EntityAtom;
    fromSchema(schema: any) {
        this.atom = schema.atom;
    }
    override scan(biz: Biz, bud: BizBud) {
        this.bizAtom = biz.entityFromId(this.atom);
    }
}
abstract class BudOptions extends BudDataType {
    private optionsName: string;
    options: EntityOptions;
    get dataType(): 'string' | 'number' { return; }
    override scan(biz: Biz, bud: BizBud) {
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
    valueToContent(value: string | number) {
        let v = value as number;
        return contentFromDays(v);
    }
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
    override scan(biz: Biz, bud: BizBud) {
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

interface FieldShow {
    owner: BizBud;
    items: { entity: Entity; bud: BizBud; }[];
}
export class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budDataType: BudDataType;
    defaultValue: string;
    atomParams: { [param: string]: string }; // only for BizBudAtom
    fieldShows: FieldShow[];
    constructor(biz: Biz, id: number, name: string, dataType: EnumBudType, entity: Entity) {
        super(biz, id, name, 'bud');
        this.entity = entity;
        let budDataType: BudDataType;
        switch (dataType) {
            case EnumBudType.none: budDataType = new BudNone(); break;
            case EnumBudType.arr: budDataType = new BudArr(); break;
            case EnumBudType.int: budDataType = new BudInt(); break;
            case EnumBudType.dec: budDataType = new BudDec(); break;
            case EnumBudType.char:
            case EnumBudType.str:
                budDataType = new BudString(); break;
            case EnumBudType.atom:
                budDataType = new BudAtom(); break;
            case EnumBudType.ID:
                budDataType = new BudIDIO(); break;
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
    scan() {
        this.budDataType.scan(this.biz, this);
        this.biz.addBudIds(this);
        this.fieldShows = this.scanFieldShows(this.fieldShows);
    }
    valueToContent(value: any) {
        return this.budDataType.valueToContent(value);
    }

    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                super.fromSwitch(i, val);
                break;
            case 'value': this.defaultValue = val; break;
            case 'params': this.atomParams = val; break;
            case 'fieldShows': this.fieldShows = val; break;
            case 'props':
            case 'min':
            case 'max':
            case 'show':
            case 'ex':
            case 'items':
            case 'atom':
            case 'options':
            case 'setType':
                break;
        }
    }

    private scanFieldShows(val: any) {
        if (val === undefined) return;
        let ret: FieldShow[] = [];
        for (let [owerId, items] of val) {
            ret.push({
                owner: this.entity.budColl[owerId],
                items: items.map((item: [number, number]) => {
                    const [entityId, budId] = item;
                    let entity = this.biz.entityFromId(entityId);
                    let bud = entity.budColl[budId];
                    return { entity, bud };
                }),
            })
        }
        return ret;
    }
}

export class BizBudBinValue extends BizBud {
    values: BizBud[] = [];
    constructor(biz: Biz, id: number, name: string, entity: Entity) {
        super(biz, id, name, EnumBudType.dec, entity);
    }
    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                super.fromSwitch(i, val);
                break;
            case 'values':
                this.values = (val as any[]).map(v => this.fromProp(v));
                break;
        }
    }

    private fromProp(prop: any) {
        let { id, name, dataType } = prop;
        let bizBud = new BizBud(this.biz, id, name, dataType, this.entity);
        let { budDataType } = bizBud;
        if (budDataType === undefined) {
            debugger;
            return;
        }
        budDataType.fromSchema(prop);
        bizBud.fromSchema(prop);
        return bizBud;
    }
}

export class BizBudSpecBase extends BizBud {
    specBud: BizBud;
}
