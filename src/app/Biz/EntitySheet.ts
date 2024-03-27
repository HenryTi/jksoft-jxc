import { BizPhraseType } from "uqs/UqDefault";
import { Biz } from "./Biz";
import { BizBud, BizBudBinValue, BizBudSpecBase, BudAtom, EnumBudType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom, EntitySpec } from "./EntityAtom";
import { EntityQuery } from "./EntityQuery";
import { UI } from "app/ui";
import { BudValue } from "tonwa-app";
import { contentFromDays } from "app/tool";

export interface PickParam {
    name: string;
    bud: string;
    prop: string;       // prop of bud
}

export abstract class BinPick extends BizBud {
    readonly bin: EntityBin;
    pickParams: PickParam[];
    // pick: PickBase;
    constructor(biz: Biz, id: number, name: string, bin: EntityBin) {
        super(biz, id, name, EnumBudType.pick, bin);
        this.bin = bin;
    }

    abstract get fromPhraseType(): BizPhraseType;
    getRefEntities(arrEntity: Entity[]) { return; }
}

/*
export abstract class PickBase {
    bizPhraseType: BizPhraseType;
    // 代码编辑页面用。所有相关的entities
    abstract getRefEntities(): Entity[];
}
*/
export class PickQuery extends BinPick {
    readonly fromPhraseType = BizPhraseType.query;
    query: EntityQuery;
    override getRefEntities(arrEntity: Entity[]) { arrEntity.push(this.query); }
}
export class PickAtom extends BinPick {
    readonly fromPhraseType = BizPhraseType.atom;
    from: EntityAtom[];
}
export class PickSpec extends BinPick {
    readonly fromPhraseType = BizPhraseType.spec;
    from: EntitySpec;
}
export class PickPend extends BinPick {
    readonly fromPhraseType = BizPhraseType.pend;
    from: EntityPend;
    getRefEntities(arrEntity: Entity[]) { arrEntity.push(this.from); }
}

export abstract class PendInput extends BizBud {
    entityPend: EntityPend;
    build(val: any): void {
        this.ui = val.ui;
    }
}

export class PendInputSpec extends PendInput {
    spec: EntitySpec;
    baseExp: string;
    build(val: any): void {
        super.build(val);
        const { spec, base } = val;
        this.spec = this.biz.entityFromId(spec) as EntitySpec;
        this.bizPhraseType = this.spec.bizPhraseType;
        this.baseExp = base;
    }
}

export class PendInputAtom extends PendInput {
    atom: EntityAtom;
    build(val: any): void {
        super.build(val);
        const { atom } = val;
        this.atom = this.biz.entityFromId(atom) as EntityAtom;
        this.bizPhraseType = this.atom.bizPhraseType;
    }
}

export class BinDiv {
    readonly entityBin: EntityBin;
    readonly parent: BinDiv;
    readonly level: number;
    binBuds: BinBuds;
    inputs: PendInput[];
    buds: BizBud[];
    div: BinDiv;
    ui: Partial<UI>;
    constructor(entityBin: EntityBin, parent: BinDiv) {
        this.entityBin = entityBin;
        this.parent = parent;
        this.level = parent === undefined ? 0 : parent.level + 1;
    }
}

export enum ValueSetType {
    none,
    init,
    equ,
    show,
}

export interface BinRow {
    id: number;
    i?: number;
    x?: number;
    value?: number;
    price?: number;
    amount?: number;
    buds?: { [bud: number]: string | number };
    owned?: { [bud: number]: [number, BudValue][] };
};

export abstract class BinField {
    readonly name: string;
    readonly bud: BizBud;
    readonly valueSet: string;
    readonly valueSetType: ValueSetType;
    constructor(bud: BizBud) {
        this.name = bud.name;
        this.bud = bud;
        let { defaultValue } = bud;
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
    abstract getValue(binRow: BinRow): any;
    abstract setValue(binRow: BinRow, v: any): void;
    abstract get onForm(): boolean;
    get required(): boolean { return this.bud.ui.required; }
}

class FieldI extends BinField {
    readonly onForm = false;
    getValue(binRow: BinRow): any { return binRow.i; }
    setValue(binRow: BinRow, v: any) { binRow.i = v; }
}

class FieldX extends BinField {
    readonly onForm = false;
    getValue(binRow: BinRow): any { return binRow.x; }
    setValue(binRow: BinRow, v: any) { binRow.x = v; }
}

class FieldValue extends BinField {
    readonly onForm = true;
    getValue(binRow: BinRow): any { return binRow.value; }
    setValue(binRow: BinRow, v: any) { binRow.value = v; }
    get required(): boolean { return true; }
}

class FieldPrice extends BinField {
    readonly onForm = true;
    getValue(binRow: BinRow): any { return binRow.price; }
    setValue(binRow: BinRow, v: any) { binRow.price = v; }
}

class FieldAmount extends BinField {
    readonly onForm = true;
    getValue(binRow: BinRow): any { return binRow.amount; }
    setValue(binRow: BinRow, v: any) { binRow.amount = v; }
}

class FieldBud extends BinField {
    readonly onForm = true;
    getValue(binRow: BinRow): any { return binRow.buds[this.bud.id]; }
    setValue(binRow: BinRow, v: any) { binRow.buds[this.bud.id] = v; }
}

class FieldDateBud extends FieldBud {
    getValue(binRow: BinRow): any {
        let v = binRow.buds[this.bud.id];
        return contentFromDays(v as number);
    }
}

class FieldCheckBud extends FieldBud {
    getValue(binRow: BinRow): any {
        let v = binRow.buds[this.bud.id];
        return v;
    }
}

class FieldRadioBud extends FieldBud {
    getValue(binRow: BinRow): any {
        let v = binRow.buds[this.bud.id];
        return v;
    }
}

export class BudsFields {
    protected readonly fieldColl: { [name: string]: BinField } = {};
    readonly entityBin: EntityBin;
    readonly hasIBase: boolean;
    readonly hasXBase: boolean;
    readonly budI: BizBud;
    readonly budX: BizBud;
    readonly budPrice: BizBud;
    readonly budAmount: BizBud;
    readonly budValue: BizBud;

    readonly allFields: BinField[];
    readonly fields: BinField[];
    readonly fieldI: BinField;
    readonly fieldX: BinField;
    readonly fieldPrice: BinField;
    readonly fieldAmount: BinField;
    readonly fieldValue: BinField;

    constructor(bin: EntityBin, buds: BizBud[]) {
        this.entityBin = bin;
        this.allFields = [];
        this.fields = [];
        const { i: budI, x: budX, value: budValue, price: budPrice, amount: budAmount, buds: budArr } = bin;
        /*
        function fieldOfBud(bud: BizBud): new (bud: BizBud) => BinField {
            if (budArr.findIndex(v => v === bud) >= 0) {
                switch (bud.budDataType.type) {
                    default: return FieldBud;
                    case EnumBudType.date: return FieldDateBud;
                    case EnumBudType.check: return FieldCheckBud;
                    case EnumBudType.radio: return FieldRadioBud;
                }
            }
            if (bud === iBud) return FieldI;
            if (bud === xBud) return FieldX;
            if (bud === budValue) return FieldValue;
            if (bud === budPrice) return FieldPrice;
            if (bud === budAmount) return FieldAmount;
            // debugger; .i will not list here
            return undefined;
        }
        */
        for (let bud of buds) {
            if (bud.name[0] === '.') {
                switch (bud.name) {
                    case '.i': this.hasIBase = true; continue;
                    case '.x': this.hasXBase = true; continue;
                }
            }

            let field: BinField;
            if (bud === budI) {
                this.budI = bud;
                this.fieldI = field = new FieldI(bud);
            }
            else if (bud === budX) {
                this.budX = bud;
                this.fieldX = field = new FieldX(bud);
            }
            else if (bud === budValue) {
                this.budValue = bud;
                this.fieldValue = field = new FieldValue(bud);
            }
            else if (bud === budPrice) {
                this.budPrice = bud;
                this.fieldPrice = field = new FieldPrice(bud);
            }
            else if (bud === budAmount) {
                this.budAmount = bud;
                this.fieldAmount = field = new FieldAmount(bud);
            }
            else if (budArr.findIndex(v => v === bud) >= 0) {
                let BF: (new (bud: BizBud) => BinField);
                switch (bud.budDataType.type) {
                    default: BF = FieldBud; break;
                    case EnumBudType.date: BF = FieldDateBud; break;
                    case EnumBudType.check: BF = FieldCheckBud; break;
                    case EnumBudType.radio: BF = FieldRadioBud; break;
                }
                field = new BF(bud);
                this.fields.push(field);
            }
            else {
                debugger;
                throw Error('should not be here');
            }

            /*
            if (bud === budValue) this.budValue = budValue
            let Field = fieldOfBud(bud);
            if (Field === undefined) continue;
            field = new Field(bud);
            */
            this.fieldColl[field.name] = field;
            this.allFields.push(field);
            // if (bud === this.budValue) this.fieldValue = field;
        }
    }
}

export class BinBuds extends BudsFields {
    readonly binDiv: BinDiv;
    constructor(binDiv: BinDiv) {
        super(binDiv.entityBin, binDiv.buds);
        this.binDiv = binDiv;
    }
}

export class EntityBin extends Entity {
    main: EntityBin;
    binPicks: BinPick[];
    rearPick: BinPick;          // endmost pick
    div: BinDiv;
    divLevels: number;
    i: BizBud;
    x: BizBud;
    pend: EntityPend;
    value: BizBud;
    price: BizBud;
    amount: BizBud;

    // 在代码界面上显示需要。本entity引用的entities
    override getRefEntities(arrEntity: Entity[]) {
        if (this.binPicks !== undefined) {
            for (let pick of this.binPicks) {
                this.getSubs(arrEntity, pick);
            }
        }
        this.getSubs(arrEntity, this.rearPick);
    }

    private getSubs(arrEntity: Entity[], binPick: BinPick) {
        if (binPick === undefined) return;
        binPick.getRefEntities(arrEntity);
    }

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'main': this.main = this.biz.entityFromId<EntityBin>(val); break;
            case 'picks': this.binPicks = val; break;
            case 'inputs': break;   // is a must
            case 'div': this.div = val; break;
            case 'i': this.i = val; break;
            case 'x': this.x = val; break;
            case 'pend': this.fromPend(val); break;
            case 'value': this.fromBinValue(val); break;
            case 'price': this.fromPrice(val); break;
            case 'amount': this.fromAmount(val); break;
        }
    }

    private fromPend(pend: any) {
        this.pend = this.biz.entityFromId<EntityPend>(pend);
    }

    private fromValue(prop: any) {
        this.value = this.fromProp(prop);
    }
    protected fromBinValue(prop: any) {
        if (prop === undefined) debugger;
        let { id, name, values } = prop;
        let bizBud = new BizBudBinValue(this.biz, id, name, this);
        this.buildBud(bizBud, prop);
        if (values !== undefined) {
            for (let val of values) {
                bizBud.values.push(this.fromProp(val));
            }
        }
        this.value = bizBud;
    }

    private fromPrice(prop: any) {
        this.price = this.fromProp(prop);
    }

    private fromAmount(prop: any) {
        this.amount = this.fromProp(prop);
    }

    private buildBudPickable(prop: any): BizBud {
        const { id, name } = prop;
        let bud = new BizBud(this.biz, id, name, EnumBudType.atom, this);
        bud.fromSchema(prop);
        bud.budDataType.fromSchema(prop);
        bud.scan();
        this.buildPickAtomFromBud(bud);
        return bud;
    }

    private buildPickAtomFromBud(bud: BizBud) {
        if (bud.defaultValue !== undefined) return;
        if (this.binPicks === undefined) this.binPicks = [];
        let pickAtom = new PickAtom(this.biz, bud.id, bud.name + '$pick', this);
        const { bizAtom } = bud.budDataType as BudAtom;
        pickAtom.from = [bizAtom];
        pickAtom.ui = bud.ui;
        this.binPicks.push(pickAtom);
    }

    private buildPick(v: any): BinPick {
        const { id, name, from, caption, params } = v;
        let arr = (from as string[]).map(v => this.biz.entities[v]);
        // let ret = new BinPick(this.biz, id, name, this);
        let entity = arr[0];
        if (entity === undefined) return;
        let { bizPhraseType } = entity;
        // {
        //    let pickBase = undefined; // buildPickInput();
        //    ret.pick = pickBase;
        //    return ret;
        // }
        let binPick: BinPick;
        const buildPickAtom = () => {
            let pick = new PickAtom(this.biz, id, name, this);
            pick.from = arr as EntityAtom[];
            return pick;
        }
        const buildPickSpec = () => {
            let pick = new PickSpec(this.biz, id, name, this);
            pick.from = entity as EntitySpec;
            return pick;
        }
        const buildPickQuery = () => {
            let pick = new PickQuery(this.biz, id, name, this);
            pick.query = entity as EntityQuery;
            return pick;
        }
        const buildPickPend = () => {
            let pick = new PickPend(this.biz, id, name, this);
            pick.from = entity as EntityPend;
            return pick;
        }
        switch (bizPhraseType) {
            default: binPick = undefined; break;
            case BizPhraseType.atom: binPick = buildPickAtom(); break;
            case BizPhraseType.spec: binPick = buildPickSpec(); break;
            case BizPhraseType.query: binPick = buildPickQuery(); break;
            case BizPhraseType.pend: binPick = buildPickPend(); break;
        }
        binPick.pickParams = params;
        binPick.ui = { caption };
        // binPick.bizPhraseType = bizPhraseType;
        // ret.pick = binPick;
        return binPick;
    }

    private buildInput(v: any): PendInput {
        const { id, name, spec, atom } = v;
        let input: PendInput;
        if (spec !== undefined) {
            input = new PendInputSpec(this.biz, id, name, undefined, this);
        }
        else if (atom !== undefined) {
            input = new PendInputAtom(this.biz, id, name, undefined, this);
        }
        else {
            debugger;
            return;
        }
        input.build(v);
        return input;
    }

    scan() {
        super.scan();
        if (this.binPicks !== undefined) {
            this.binPicks = this.binPicks.map(v => this.buildPick(v as any));
        }
        if (this.i !== undefined) {
            this.i = this.buildBudPickable(this.i as any);
        }
        if (this.x !== undefined) {
            this.x = this.buildBudPickable(this.x as any);
        }
        if (this.binPicks !== undefined) {
            let pLast = this.binPicks.length - 1;
            this.rearPick = this.binPicks[pLast];
            this.binPicks.splice(pLast, 1);
        }
        let div = this.div;
        this.div = new BinDiv(this, undefined);
        this.divLevels = 0;
        this.scanDiv(this.div, div);
    }

    private scanDiv(binDiv: BinDiv, div: any) {
        let { inputs, div: subDiv, buds, ui } = div;
        binDiv.ui = ui;
        binDiv.inputs = this.scanInputs(inputs);
        binDiv.buds = this.scanBinBuds(buds);
        binDiv.binBuds = new BinBuds(binDiv);
        if (subDiv !== undefined) {
            ++this.divLevels;
            let subBinDiv = binDiv.div = new BinDiv(this, binDiv);
            this.scanDiv(subBinDiv, subDiv);
        }
    }

    private scanInputs(inputs: any[]) {
        if (inputs === undefined) return;
        return inputs.map(v => {
            let input = this.buildInput(v as any);
            input.entityPend = this.pend;
            return input;
        });
    }

    private scanBinBuds(buds: any[]) {
        if (buds === undefined) return;
        let ret: BizBud[] = [];
        let iBaseBud: BizBudSpecBase;
        let xBaseBud: BizBudSpecBase;
        for (let bud of buds) {
            let bizBud: BizBud;
            switch (bud) {
                default: bizBud = this.budColl[bud]; break;
                case 'i': bizBud = this.i; break;
                case 'x': bizBud = this.x; break;
                case '.i':
                case 'i.':
                    bizBud = iBaseBud = new BizBudSpecBase(this.biz, 0, '.i', EnumBudType.none, this);
                    break;
                case '.x':
                case 'x.':
                    bizBud = xBaseBud = new BizBudSpecBase(this.biz, 0, '.x', EnumBudType.none, this);
                    break;
                case 'value': bizBud = this.value; break;
                case 'price': bizBud = this.price; break;
                case 'amount': bizBud = this.amount; break;
            }
            if (bizBud === undefined) debugger;
            ret.push(bizBud);
        }
        if (iBaseBud !== undefined) iBaseBud.specBud = this.i;
        if (xBaseBud !== undefined) xBaseBud.specBud = this.x;
        return ret;
    }

    proxyHandler() {
        return new BinProxyHander(this);
    }
}

const binFields = ['i', 'x', 'value', 'price', 'amount'];
class BinProxyHander implements ProxyHandler<any> {
    private readonly entityBin: EntityBin;
    constructor(entityBin: EntityBin) {
        this.entityBin = entityBin;
    }
    get(target: any, p: string | symbol, receiver: any) {
        if (binFields.findIndex(v => v === p) >= 0) {
            let ret = target[p];
            return ret
        }
        let bud = this.entityBin.budColl[p as string];
        if (bud === undefined) return;
        let ret = target.buds[bud.id];
        return ret;
    }
}

export const predefinedPendFields = [
    's', 'si', 'sx', 'svalue', 'sprice', 'samount'
    , 'i', 'x', 'value', 'price', 'amount'
    , 'pendvalue', 'origin', 'pend', 'pendValue'
];

export class EntityPend extends Entity {
    predefined: { [name: string]: BizBud };
    predefinedFields: string[];
    i: BizBud;
    x: BizBud;
    params: BizBud[];
    private cols: BizBud[];

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                if (predefinedPendFields.includes(i) === true) break;
                super.fromSwitch(i, val); break;
            case 'predefined': this.predefined = val; break;
            case 'params': this.params = val; break;
            case 'cols': this.cols = val; break;
            case 'i': this.i = val; break;
            case 'x': this.x = val; break;
            case 'predefinedFields': this.predefinedFields = val; break;
        }
    }

    scan(): void {
        super.scan();
        if (this.cols !== undefined) {
            for (let bud of this.cols) {
                if (bud === undefined) continue;
                this.budColl[bud.id] = bud;
            }
        }
    }
}

export class EntitySheet extends Entity {
    io: boolean;
    main: EntityBin;
    coreDetail: EntityBin;
    readonly details: {
        bin: EntityBin;
        caption: string;
    }[] = [];
    search: { bin: EntityBin; buds: BizBud[]; }[];

    getRefEntities(arrEntity: Entity[]) {
        if (this.main !== undefined) arrEntity.push(this.main);
        arrEntity.push(...this.details.map(v => v.bin));
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'io': this.fromIO(val); break;
            case 'main': this.fromMain(val); break;
            case 'details': this.fromDetails(val); break;
            case 'search': this.search = val; break;
        }
    }

    private fromIO(io: any) {
        this.io = io;
    }

    private fromMain(main: any) {
        this.main = this.biz.entities[main] as EntityBin;
    }

    protected fromDetails(details: any[]) {
        for (let { bin, caption } of details) {
            this.details.push({
                bin: this.biz.entities[bin] as EntityBin,
                caption,
            })
        }
        this.coreDetail = this.details[0]?.bin;
    }

    scan(): void {
        if (this.search !== undefined) {
            let search: { bin: EntityBin; buds: BizBud[]; }[] = [];
            for (let i in this.search) {
                let s = this.search[i];
                let id = Number(i);
                let bin: EntityBin;
                if (this.main.id === id) {
                    bin = this.main;
                }
                else {
                    for (let { bin: binDetail } of this.details) {
                        if (binDetail.id === id) {
                            bin = binDetail;
                            break;
                        }
                    }
                }
                let buds: BizBud[];
                if (s === undefined) {
                    buds = [];
                }
                else if (Array.isArray(s) === true) {
                    buds = (s as unknown as number[]).map(v => this.budFromId(bin, v));
                }
                else if (typeof (s) === 'number') {
                    buds = [this.budFromId(bin, s as unknown as number)];
                }
                search.push({ bin, buds });
            }
            this.search = search;
        }
    }

    private budFromId(bin: EntityBin, budId: number) {
        let bud: BizBud;
        const { i, x, budColl } = bin;
        if (budId === i?.id) {
            bud = i;
        }
        else if (budId === x?.id) {
            bud = x;
        }
        else {
            bud = budColl[budId];
        }
        return bud;
    }
}
