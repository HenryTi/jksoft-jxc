import { BizPhraseType } from "uqs/UqDefault";
import { Biz } from "./Biz";
import { BizBud, BizBudBinValue, BudID, BudDec, BudRadio, EnumBudType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom, EntitySpec } from "./EntityAtom";
import { EntityQuery } from "./EntityQuery";
import { UI } from "app/ui";
import { BudValue } from "tonwa-app";
import { OptionsItem } from ".";

export class PickParam extends BizBud {
    // name: string;
    bud: string;
    prop: string;       // prop of bud

    protected fromSwitch(i: string, val: any): void {
        switch (i) {
            default:
                super.fromSwitch(i, val);
                break;
            case 'value':
                this.fromVal(val);
                break;
        }
    }

    private fromVal(val: string) {
        let [v, s] = val.split('\n');
        if (v[0] === '%') {
            let [bud, prop] = v.split('.');
            this.bud = bud;
            this.prop = prop;
            return;
        }
        switch (v) {
            default:
                if (v.includes('(') === true) {
                    if (v.includes('CURDATE') === true) break;
                    debugger;
                    break;
                }
                this.bud = v;
                break;
            case '_si':
                this.bud = '%sheet';
                this.prop = 'i';
                break;
            case '_sx':
                this.bud = '%sheet';
                this.prop = 'x';
                break;
        }
    }
}

export abstract class BinPick extends BizBud {
    readonly bin: EntityBin;
    pickParams: PickParam[];
    hiddenBuds: Set<number>;
    constructor(biz: Biz, id: number, name: string, bin: EntityBin) {
        super(biz, id, name, EnumBudType.pick, bin);
        this.bin = bin;
    }

    abstract get fromPhraseType(): BizPhraseType;
    getRefEntities(arrEntity: Entity[]) { return; }
}

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
    baseParam: string;
    from: EntitySpec;
}
export class PickPend extends BinPick {
    readonly fromPhraseType = BizPhraseType.pend;
    from: EntityPend;
    getRefEntities(arrEntity: Entity[]) { arrEntity.push(this.from); }
}

export abstract class BinInput extends BizBud {
    entityPend: EntityPend;
    build(val: any): void {
        this.ui = val.ui;
    }
}

export class BinInputSpec extends BinInput {
    spec: EntitySpec;
    baseExp: string;
    baseBud: BizBud;        // 以后不允许表达式。只能是bud id
    build(val: any): void {
        super.build(val);
        const { spec, base } = val;
        this.spec = this.biz.entityFromId(spec) as EntitySpec;
        this.bizPhraseType = this.spec.bizPhraseType;
        let baseBud = this.biz.budFromId(base);
        if (baseBud !== undefined) {
            this.baseBud = baseBud;
        }
        else {
            this.baseExp = base;
        }
    }
}

export class BinInputAtom extends BinInput {
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
    binDivBuds: BinDivBuds;
    inputs: BinInput[];
    buds: BizBud[];
    subBinDiv: BinDiv;
    key: BizBud;
    format: [BizBud, boolean, OptionsItem][];
    ui: Partial<UI>;
    constructor(entityBin: EntityBin, parent: BinDiv) {
        this.entityBin = entityBin;
        this.parent = parent;
        this.level = parent === undefined ? 0 : parent.level + 1;
    }
}

export interface BinRow {
    id: number;
    i?: number;
    iBase?: number;
    x?: number;
    xBase?: number;
    value?: number;
    price?: number;
    amount?: number;
    buds?: { [bud: number]: string | number };
    owned?: { [bud: number]: [number, BudValue][] };
};

abstract class BinBudValue {
    readonly bud: BizBud;
    constructor(bud: BizBud) {
        this.bud = bud;
    }
    abstract getValue(binRow: BinRow): any;
    abstract setValue(binRow: BinRow, value: any): void;
}
class BinI extends BinBudValue {
    getValue(binRow: BinRow): any { return binRow.i; }
    setValue(binRow: BinRow, value: any) { binRow.i = value; }
}
class BinX extends BinBudValue {
    getValue(binRow: BinRow): any { return binRow.x; }
    setValue(binRow: BinRow, value: any) { binRow.x = value; }
}
class BinBuds extends BinBudValue {
    getValue(binRow: BinRow): any { return binRow.buds[this.bud.id]; }
    setValue(binRow: BinRow, value: any) { binRow.buds[this.bud.id] = value; }
}
class BinValue extends BinBudValue {
    getValue(binRow: BinRow): any { return binRow.value; }
    setValue(binRow: BinRow, value: any) { binRow.value = value; }
}
class BinPrice extends BinBudValue {
    getValue(binRow: BinRow): any { return binRow.price; }
    setValue(binRow: BinRow, value: any) { binRow.price = value; }
}
class BinAmount extends BinBudValue {
    getValue(binRow: BinRow): any { return binRow.amount; }
    setValue(binRow: BinRow, value: any) { binRow.amount = value; }
}

export abstract class BudValuesToolBase<T> {
    allFields: BizBud[]; // BinField[];         // 传进来的buds
    fields: BizBud[]; // BinField[];            // bin的buds
    abstract has(bud: BizBud): boolean;
    abstract getBudValue(bud: BizBud, binRow: T): any;
    abstract setBudValue(bud: BizBud, binRow: T, value: any): void;
}

export class BudValuesTool extends BudValuesToolBase<any> {
    readonly coll: { [budId: number]: BizBud; } = {};
    constructor(buds: BizBud[]) {
        super();
        this.allFields = buds;
        this.fields = buds;
        for (let bud of buds) this.coll[bud.id] = bud;
    }

    has(bud: BizBud): boolean {
        return this.coll[bud.id] !== undefined;
    }
    getBudValue(bud: BizBud, binRow: any): any {
        return binRow[bud.id];
    }
    setBudValue(bud: BizBud, binRow: any, value: any): void {
        binRow[bud.id] = value;
    }
}

export class BinRowValuesTool extends BudValuesToolBase<BinRow> {
    readonly coll: { [budId: number]: BinBudValue; } = {};
    readonly entityBin: EntityBin;
    readonly budI: BizBud;
    readonly budIBase: BizBud;
    readonly budX: BizBud;
    readonly budXBase: BizBud;
    readonly budValue: BizBud;
    readonly budAmount: BizBud;
    readonly budPrice: BizBud;

    constructor(bin: EntityBin, buds: BizBud[]) {
        super();
        this.entityBin = bin;
        const { i, iBase, x, xBase, value, price, amount } = bin;
        this.allFields = [];
        this.fields = [];
        for (let bud of buds) {
            if (i === bud) {
                const { id } = bud;
                this.coll[id] = new BinI(bud);
                this.budI = bud;
                this.allFields.push(bud);
            }
            else if (iBase === bud) {
                const { id } = bud;
                this.coll[id] = new BinBuds(bud);
                this.budIBase = bud;
                this.allFields.push(bud);
            }
            else if (x === bud) {
                const { id } = bud;
                this.coll[id] = new BinX(bud);
                this.budX = bud;
                this.allFields.push(bud);
            }
            else if (xBase === bud) {
                const { id } = bud;
                this.coll[id] = new BinBuds(bud);
                this.budXBase = bud;
                this.allFields.push(bud);
            }
            else if (value === bud) {
                const { id } = bud;
                this.coll[id] = new BinValue(bud);
                this.budValue = bud;
                this.allFields.push(bud);
            }
            else if (price === bud) {
                const { id } = bud;
                this.coll[id] = new BinPrice(bud);
                this.budPrice = bud;
                this.allFields.push(bud);
            }
            else if (amount === bud) {
                const { id } = amount;
                this.coll[id] = new BinAmount(bud);
                this.budAmount = bud;
                this.allFields.push(bud);
            }
            else {
                const { id } = bud;
                this.coll[id] = new BinBuds(bud);
                this.allFields.push(bud);
                this.fields.push(bud);
            }
        }
    }
    has(bud: BizBud) {
        let binBud = this.coll[bud.id];
        return binBud !== undefined;
    }

    getBudValue(bud: BizBud, binRow: BinRow) {
        let binBud = this.coll[bud.id];
        if (binBud === undefined) debugger; // return binRow.buds[bud.id];
        return binBud.getValue(binRow);
    }
    setBudValue(bud: BizBud, binRow: BinRow, value: any) {
        let binBud = this.coll[bud.id];
        if (binBud === undefined) debugger; // binRow.buds[bud.id] = value;
        else binBud.setValue(binRow, value);
    }
}

export class BinDivBuds extends BinRowValuesTool /*extends BinBudsFields*/ {
    readonly binDiv: BinDiv;
    keyField: BizBud; // BinField;

    constructor(binDiv: BinDiv) {
        const { buds, key } = binDiv;
        super(binDiv.entityBin, buds);
        this.binDiv = binDiv;
        if (key !== undefined) {
            this.keyField = key;
        }
    }
}

export class EntityBin extends Entity {
    main: EntityBin;
    binPicks: BinPick[];
    rearPick: BinPick;          // endmost pick
    binDivRoot: BinDiv;
    divLevels: number;
    i: BizBud;
    x: BizBud;
    iBase: BizBud;
    xBase: BizBud;
    pend: EntityPend;
    value: BizBud;
    price: BizBud;
    amount: BizBud;
    pivot: BinDiv;

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
            case 'div': this.binDivRoot = val; break;
            case 'i': this.i = val; this.budColl[this.i.id] = this.i; break;
            case 'iBase': this.iBase = val; this.budColl[this.iBase.id] = this.iBase; break;
            case 'x': this.x = val; this.budColl[this.x.id] = this.x; break;
            case 'xBase': this.xBase = val; this.budColl[this.xBase.id] = this.xBase; break;
            case 'pend': this.fromPend(val); break;
            case 'value': this.fromBinValue(val); break;
            case 'price': this.fromPrice(val); break;
            case 'amount': this.fromAmount(val); break;
            case 'pivot': this.pivot = true as any; break;
        }
    }

    private fromPend(pend: any) {
        this.pend = this.biz.entityFromId<EntityPend>(pend);
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

    private buildAtomBud(prop: any): BizBud {
        const { id, name } = prop;
        let bud = new BizBud(this.biz, id, name, EnumBudType.atom, this);
        this.budColl[id] = bud;
        bud.fromSchema(prop);
        bud.budDataType.fromSchema(prop);
        bud.scan();
        return bud;
    }

    private buildBudPickable(prop: any): BizBud {
        let bud = this.buildAtomBud(prop);
        this.buildPickIDFromBud(bud);
        return bud;
    }

    private buildPickIDFromBud(bud: BizBud) {
        if (bud.valueSet !== undefined) return;
        if (this.binPicks === undefined) this.binPicks = [];
        const { id, name, caption, ui, atomParams } = bud;
        const budID = bud.budDataType as BudID;
        const { entityID } = budID;
        const { bizPhraseType } = entityID;
        let pickID: BinPick;
        let pickName = name + '$pick';
        switch (bizPhraseType) {
            default:
                debugger;
                console.error(`buildPickIDFromBud unknown ${BizPhraseType[bizPhraseType]}`);
                break;
            case BizPhraseType.atom:
                let pickAtom = pickID = new PickAtom(this.biz, id, pickName, this);
                pickAtom.from = [entityID as EntityAtom];
                break;
            case BizPhraseType.spec:
                let pickSpec = pickID = new PickSpec(this.biz, id, pickName, this);
                pickSpec.from = entityID as EntitySpec;
                pickSpec.baseParam = atomParams?.base;
                break;
        }
        if (ui !== undefined) {
            if (ui.caption === undefined) {
                ui.caption = caption ?? name;
            }
        }
        pickID.ui = ui;
        this.binPicks.push(pickID);
    }

    private buildPick(v: any): BinPick {
        const { id, name, from, caption, params, hidden } = v;
        let arr = (from as string[]).map(v => this.biz.entities[v]);
        let entity = arr[0];
        if (entity === undefined) return;
        let { bizPhraseType } = entity;
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
        binPick.pickParams = this.buildPickParams(params);
        binPick.ui = { caption };
        if (hidden !== undefined) {
            binPick.hiddenBuds = new Set();
            const { hiddenBuds } = binPick;
            for (let h of (hidden as number[])) {
                hiddenBuds.add(h);
            }
        }
        return binPick;
    }

    private buildPickParams(params: any[]): PickParam[] {
        if (params === undefined) return;
        let pickParams: PickParam[] = [];
        for (let param of params) {
            const { name, dataType } = param;
            let pickParam = new PickParam(this.biz, 0, name, dataType, this);
            pickParam.fromSchema(param);
            pickParams.push(pickParam);
        }
        return pickParams;
    }

    private buildInput(v: any): BinInput {
        const { id, name, spec, atom } = v;
        let input: BinInput;
        if (spec !== undefined) {
            input = new BinInputSpec(this.biz, id, name, undefined, this);
        }
        else if (atom !== undefined) {
            input = new BinInputAtom(this.biz, id, name, undefined, this);
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
            this.i.onForm = false;
        }
        if (this.iBase !== undefined) {
            this.iBase = this.buildAtomBud(this.iBase as any);
            this.iBase.onForm = false;
        }
        if (this.x !== undefined) {
            this.x = this.buildBudPickable(this.x as any);
            this.x.onForm = false;
        }
        if (this.xBase !== undefined) {
            this.xBase = this.buildAtomBud(this.xBase as any);
            this.xBase.onForm = false;
        }
        if (this.binPicks !== undefined) {
            let pLast = this.binPicks.length - 1;
            this.rearPick = this.binPicks[pLast];
            this.binPicks.splice(pLast, 1);
        }
        let divSchema = this.binDivRoot;
        this.binDivRoot = new BinDiv(this, undefined);
        this.divLevels = 0;
        this.scanDiv(this.binDivRoot as any, divSchema);
    }

    private scanDiv(binDiv: BinDiv, divSchema: any) {
        let { inputs, div: subDivSchema, buds, ui, key, format } = divSchema;
        binDiv.ui = ui;
        binDiv.inputs = this.scanInputs(inputs);
        binDiv.buds = this.scanBinBuds(buds);
        if (key !== undefined) {
            binDiv.key = this.budColl[key as unknown as number];
        }
        if (format !== undefined) {
            const { entityBin } = binDiv;
            binDiv.format = (format as any[][]).map(([budId, withLabel, optionItemId]) => {
                let bud = entityBin.budColl[budId];
                let item = (bud.budDataType as BudRadio).options.coll[optionItemId];
                return [bud, withLabel === 1, item]
            });
        }
        binDiv.binDivBuds = new BinDivBuds(binDiv);
        if (subDivSchema !== undefined) {
            ++this.divLevels;
            let subBinDiv = binDiv.subBinDiv = new BinDiv(this, binDiv);
            this.scanDiv(subBinDiv, subDivSchema);
        }
        else if (this.pivot !== undefined) {
            this.pivot = binDiv;
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
        for (let bud of buds) {
            let bizBud: BizBud;
            switch (bud) {
                default: bizBud = this.budColl[bud]; break;
                case 'i': bizBud = this.i; break;
                case '.i': bizBud = this.iBase; break;
                case 'x': bizBud = this.x; break;
                case '.x': bizBud = this.xBase; break;
                case 'value': bizBud = this.value; break;
                case 'price': bizBud = this.price; break;
                case 'amount': bizBud = this.amount; break;
            }
            if (bizBud === undefined) debugger;
            ret.push(bizBud);
        }
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
    , 'i', 'x', 'value', 'price', 'amount', 'iBase', 'xBase'
    , 'pendvalue', 'origin', 'pend', 'pendValue'
];

export class EntityPend extends Entity {
    predefined: { [name: string]: BizBud };
    i: BizBud;
    x: BizBud;
    params: BizBud[];
    private cols: BizBud[];
    hasPrice: boolean;
    hasAmount: boolean;

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
            case 'predefinedFields': this.setPredefinedFields(val); break;
        }
    }

    private setPredefinedFields(predefinedFields: string[]) {
        this.hasPrice = predefinedFields.findIndex(v => v === 'price') >= 0;
        this.hasAmount = predefinedFields.findIndex(v => v === 'amount') >= 0;
    }

    scan(): void {
        super.scan();
        if (this.i !== undefined) {
            this.i = this.buildBudFromProp(this.i);
        }
        if (this.x !== undefined) {
            this.x = this.buildBudFromProp(this.x);
        }
        if (this.cols !== undefined) {
            for (let bud of this.cols) {
                if (bud === undefined) continue;
                this.budColl[bud.id] = bud;
            }
        }
        if (this.params !== undefined) {
            let params: BizBud[] = [];
            for (let param of this.params) {
                let bud = this.buildBudFromProp(param);
                params.push(bud);
            }
            this.params = params;
        }
    }

    private buildBudFromProp(prop: any): BizBud {
        const { id, name, dataType } = prop;
        let bud = new BizBud(this.biz, id, name, dataType, this);
        this.budColl[id] = bud;
        bud.fromSchema(prop);
        bud.budDataType.fromSchema(prop);
        bud.scan();
        return bud;
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
        super.scan();
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
