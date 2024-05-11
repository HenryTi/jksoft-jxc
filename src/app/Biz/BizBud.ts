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

    optionItem = 81,            // options item
    user = 98,
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
    getUIValue(value: string | number) {
        return value;
    }
    getTitleBuds(): BizBud[] { return; }
    getPrimeBuds(): BizBud[] { return; }
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
}
export class BudInt extends BudDataNumber {
    readonly type = EnumBudType.int;
}
export class BudDec extends BudDataNumber {
    readonly type = EnumBudType.dec;
    fraction: number;
    override scan(biz: Biz, bud: BizBud) {
        const { ui } = bud;
        this.fraction = ui?.fraction;
    }
    override getUIValue(value: number) {
        if (value === undefined) return;
        // if (this.fraction === undefined) return value;
        return value.toFixed(this.fraction ?? 2);
    }
    fromSchema(schema: any) {
        super.fromSchema(schema);
        let { ui } = schema;
        this.fraction = ui?.fraction;
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
    getTitleBuds(): BizBud[] { return this.bizAtom?.titleBuds; }
    getPrimeBuds(): BizBud[] { return this.bizAtom?.primeBuds; }
}
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
    //private optionsName: string;
    options: EntityOptions;
    get dataType(): 'string' | 'number' { return; }
    override scan(biz: Biz, bud: BizBud) {
        this.options = biz.entityFromId(this.options as unknown as number);
        // biz.entities[this.optionsName] as EntityOptions;
    }
    fromSchema(schema: any) {
        this.options = schema.options;
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
    override getUIValue(value: string | number) {
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

export enum ValueSetType {
    none,
    init,
    equ,
    show,
}

export class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budDataType: BudDataType;
    atomParams: { [param: string]: string }; // only for BizBudAtom
    fieldShows: BizBud[];
    valueSet: string;
    valueSetType: ValueSetType;
    onForm: boolean;            // default: true

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
        if (this.scaned === true) return;
        this.budDataType.scan(this.biz, this);
        this.biz.addBudIds(this);
        this.fieldShows = this.scanFieldShows(this.fieldShows);
        this.scaned = true;
    }
    getUIValue(value: any) {
        return this.budDataType.getUIValue(value);
    }
    get required(): boolean { return this.ui?.required; }
    getTitleBuds(): BizBud[] { return this.budDataType.getTitleBuds(); }
    getPrimeBuds(): BizBud[] { return this.budDataType.getPrimeBuds(); }
    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                super.fromSwitch(i, val);
                break;
            case 'value': this.setDefault(val); break;
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
        let ret: BizBud[] = [];
        for (let items of val) {
            //for (let item of items) {
            for (let item of items) {
                // const [entityId, budId] = item;
                let bud = this.biz.budFromId(item);
                // let entity = this.biz.entityFromId(budId);
                // let bud = entity.budColl[budId];
                // ret.push({ entity, bud });
                ret.push(bud);
            }
        }
        return ret;
    }

    private setDefault(defaultValue: string) {
        if (defaultValue !== undefined) {
            let p = defaultValue.indexOf('\n');
            if (p > 0) {
                let suffix = defaultValue.substring(p + 1);
                this.valueSet = defaultValue.substring(0, p);
                this.valueSetType = ValueSetType[suffix as keyof typeof ValueSetType];
            }
            else {
                this.valueSetType = ValueSetType.equ;
                this.valueSet = defaultValue;
            }
        }
        else {
            this.valueSetType = ValueSetType.none;
        }
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
