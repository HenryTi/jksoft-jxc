import { contentFromDays } from "../tools";
import { EntityAtom, EntityFork, EntityID, EntityPick } from "./EntityAtom";
import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";
import { EntityOptions } from './EntityOptions';
import { EntityBin } from "./EntitySheet";
import { EntityTie } from "./EntityTie";

export enum EnumBudType {
    none = 0,
    int = 11,                   // bigint
    atom = 12,                  // atom id
    radio = 13,                 // single radio ids
    check = 14,                 // multiple checks
    bin = 15,
    pick = 18,
    ID = 19,

    dec = 21,                   // dec(18.6)

    char = 31,                  // varchar(100)
    str = 32,                   // varchar(100)

    date = 41,
    datetime = 42,

    optionItem = 81,            // options item
    fork = 95,
    any = 96,
    unique = 97,
    user = 98,
    arr = 99,
};

export abstract class BudDataType {
    abstract get type(): EnumBudType;
    abstract get dataType(): string;
    min: string;
    max: string;
    fromSchema(schema: any) {
        const { min, max } = schema;
        if (min !== undefined) this.min = min[0];
        if (max !== undefined) this.max = max[0];
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
export class BudAny extends BudDataString {
    readonly type = EnumBudType.any;
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
export class BudFork extends BudDataString {
    readonly type = EnumBudType.fork;
    base: BizBud;
    fork: EntityFork;
    override fromSchema(schema: any): void {
        this.base = schema.base;
    }

    setBase(base: BizBud) {
        this.base = base;
        this.fork = (base.budDataType as BudID).entityID.fork;
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
export class BudID extends BudDataNumber {
    readonly type = EnumBudType.atom;
    entityID: EntityID;
    baseFormula: string;
    fromSchema(schema: any) {
        this.entityID = schema.atom as any;
        this.baseFormula = schema.base;
    }
    override scan(biz: Biz, bud: BizBud) {
        this.entityID = biz.entities[this.entityID as unknown as string] as EntityID;
    }
    getTitleBuds(): BizBud[] { return this.entityID?.titleBuds; }
    getPrimeBuds(): BizBud[] { return this.entityID?.primeBuds; }
}

export enum EnumSysBud {
    id = 1,
    sheetNo = 2,
    sheetOperator = 3,
    sheetDate = 4,
}
export class BudBin extends BudDataNumber {
    readonly type = EnumBudType.bin;
    entityBin: EntityBin;
    sysBuds: EnumSysBud[];
    showBuds: BizBud[];

    fromSchema(schema: any) {
        this.entityBin = schema.bin as any;
        this.sysBuds = schema.sysBuds;
        this.showBuds = schema.showBuds as any;
    }
    override scan(biz: Biz, bud: BizBud) {
        this.entityBin = biz.entities[this.entityBin as unknown as string] as EntityBin;
        if (this.entityBin !== undefined) {
            if (this.showBuds !== undefined) {
                let { main, budColl } = this.entityBin;
                this.showBuds = (this.showBuds as unknown as number[][]).map(arr => {
                    let v0 = arr[0];
                    if (arr.length === 1) return budColl[v0];
                    if (v0 !== undefined) {
                        debugger;
                    }
                    let mainBud = arr[1];
                    let budCollMain = main.budColl;
                    let bud = budCollMain[mainBud];
                    return bud;
                });
            }
        }
    }
    getPrimeBuds(): BizBud[] {
        return this.showBuds;
    }
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
export abstract class BudOptions extends BudDataType {
    options: EntityOptions;
    get dataType(): 'string' | 'number' { return; }
    override scan(biz: Biz, bud: BizBud) {
        this.options = biz.entityFromId(this.options as unknown as number);
    }
    fromSchema(schema: any) {
        this.options = schema.options;
    }
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
    none = 0,
    init = 2,
    equ = 1,
    show = 3,
    bound = 4,
}

export class BizBud extends BizBase {
    readonly entity: Entity;
    readonly budDataType: BudDataType;
    atomParams: { [param: string]: string }; // only for BizBudID
    fieldShows: BizBud[];
    valueSet: string;
    valueSetType: ValueSetType;
    onForm: boolean;            // default: trueWITH IxBudInt I=id X=bud SET value=value;B
    tie: { tie: BizBud | EntityTie; on: string; }

    constructor(biz: Biz, id: number, name: string, dataType: EnumBudType, entity: Entity) {
        super(biz, id, name, 'bud');
        this.entity = entity;
        let budDataType: BudDataType;
        switch (dataType) {
            default: budDataType = undefined; break;
            case EnumBudType.none: budDataType = new BudNone(); break;
            case EnumBudType.any: budDataType = new BudAny(); break;
            case EnumBudType.arr: budDataType = new BudArr(); break;
            case EnumBudType.fork: budDataType = new BudFork(); break;
            case EnumBudType.int: budDataType = new BudInt(); break;
            case EnumBudType.dec: budDataType = new BudDec(); break;
            case EnumBudType.char:
            case EnumBudType.str:
                budDataType = new BudString(); break;
            case EnumBudType.atom:
                budDataType = new BudID(); break;
            case EnumBudType.bin:
                budDataType = new BudBin(); break;
            case EnumBudType.ID:
                budDataType = new BudIDIO(); break;
            case EnumBudType.pick:
                budDataType = new BudPickable(); break;
            case EnumBudType.radio: budDataType = new BudRadio(); break;
            case EnumBudType.check: budDataType = new BudCheck(); break;
            case EnumBudType.date: budDataType = new BudDate(); break;
            case EnumBudType.datetime: budDataType = new BudDateTime(); break;
        }
        this.budDataType = budDataType;
    }
    scan() {
        if (this.scaned === true) return;
        if (this.budDataType !== undefined) {
            this.budDataType.scan(this.biz, this);
        }
        this.biz.addBudIds(this);
        this.fieldShows = this.scanFieldShows(this.fieldShows);
        this.scanTie();
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
            case 'value':
                this.setDefault(val); break;
            case 'params':
                this.atomParams = val; break;
            case 'fieldShows': this.fieldShows = val; break;
            case 'tie': this.tie = val; break;
            case 'props':
            case 'min':
            case 'max':
            case 'show':
            case 'ex':
            case 'items':
            case 'atom':
            case 'options':
            case 'setType':
            case 'base':
                break;
        }
    }

    private scanFieldShows(val: any) {
        if (val === undefined) return;
        let ret: BizBud[] = [];
        for (let items of val) {
            for (let item of items) {
                let bud = this.biz.budFromId(item);
                ret.push(bud);
            }
        }
        return ret;
    }

    private setDefault(defaultValue: [string, number]) {
        let vt: ValueSetType;
        if (defaultValue !== undefined) {
            const [dv, type] = defaultValue;
            this.valueSet = dv;
            vt = (type as ValueSetType) ?? ValueSetType.equ;
        }
        else {
            vt = ValueSetType.none;
        }
        this.valueSetType = vt;
    }

    private scanTie() {
        if (this.tie === undefined) return;
        const { id, on } = this.tie as any;
        let tie: EntityTie | BizBud = this.biz.entities[id] as EntityTie;
        if (tie === undefined) {
            tie = this.biz.budFromId(id);
        }
        this.tie = { tie, on };
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
