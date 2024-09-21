import { BizPhraseType } from "uqs/UqDefault";
import { Biz } from "./Biz";
import { BizBud, BizBudBinValue, BudFork, BudID, BudRadio, EnumBudType, ValueSetType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom, EntityFork } from "./EntityAtom";
import { EntityQuery } from "./EntityQuery";
import { UI } from "app/ui";
import { BudValue } from "tonwa-app";
import { EntityOptions, OptionsItem } from ".";
import { BudsEditing } from "app/hooks";

export class PickParam extends BizBud {
}

export abstract class BinPick extends BizBud {
    readonly bin: EntityBin;
    pickParams: PickParam[];
    hiddenBuds: Set<number>;
    on: BizBud;
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
    readonly fromPhraseType = BizPhraseType.fork;
    baseParam: string;
    from: EntityFork;
}
export class PickPend extends BinPick {
    readonly fromPhraseType = BizPhraseType.pend;
    from: EntityPend;
    getRefEntities(arrEntity: Entity[]) { arrEntity.push(this.from); }
}
export class PickOptions extends BinPick {
    readonly fromPhraseType = BizPhraseType.options;
    from: EntityOptions;
}

export abstract class BinInput extends BizBud {
    entityPend: EntityPend;
    build(val: any): void {
        this.ui = val.ui;
    }
}

export interface InputSpecParam {
    bud: BizBud;
    valueSet: string;
    valueSetType: ValueSetType;
}

export class BinInputFork extends BinInput {
    spec: EntityFork;
    baseExp: string;
    baseBud: BizBud;        // 以后不允许表达式。只能是bud id
    params: InputSpecParam[];
    build(val: any): void {
        super.build(val);
        const { spec, base, params } = val;
        if (spec !== undefined) {
            this.spec = this.biz.entityFromId(spec) as EntityFork;
            this.bizPhraseType = this.spec.bizPhraseType;
            this.params = (params as [number, string, string][]).map(([budId, formula, setType]) => {
                return {
                    bud: this.spec.getBud(budId),
                    valueSet: formula,
                    valueSetType: setType === '=' ? ValueSetType.equ : ValueSetType.init,
                };
            });
        }
        else {
            if (params.length > 0) {
                const [budId, formula, setType] = (params as [number, string, string][])[0];
                this.params = [{
                    bud: undefined,
                    valueSet: formula,
                    valueSetType: setType === '=' ? ValueSetType.equ : ValueSetType.init,
                }];
            }
        }
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

// BinDiv 的主从字段状态
export enum IXType {
    base,
    me,
    sub,
    both,
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
    // pivot format
    format: [BizBud, boolean, OptionsItem][];
    ui: Partial<UI>;
    iType: IXType;
    xType: IXType;
    constructor(entityBin: EntityBin, parent: BinDiv) {
        this.entityBin = entityBin;
        this.parent = parent;
        this.level = parent === undefined ? 0 : parent.level + 1;
    }

    hasIBase(): boolean {
        switch (this.iType) {
            default:
                if (this.parent === undefined) return false;
                return this.parent.hasIBase();
            case IXType.base: return true;
            case IXType.me:
            case IXType.sub: return false;
        }
    }

    hasXBase(): boolean {
        switch (this.xType) {
            default:
                if (this.parent === undefined) return false;
                return this.parent.hasXBase();
            case IXType.base: return true;
            case IXType.me:
            case IXType.sub: return false;
        }
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
    protected readonly editing: BudsEditing;
    allFields: BizBud[];
    fields: BizBud[];
    constructor(editing: BudsEditing) {
        this.editing = editing;
    }
    abstract has(bud: BizBud): boolean;
    abstract getBudValue(bud: BizBud, binRow: T): any;
    abstract setBudValue(bud: BizBud, binRow: T, value: any): void;
    clearValue(bud: BizBud, binRow: T): void {
        this.setBudValue(bud, binRow, undefined);
    }
}

export class BudValuesTool extends BudValuesToolBase<any> {
    readonly coll: { [budId: number]: BizBud; } = {};
    constructor(editing: BudsEditing, buds: BizBud[]) {
        super(editing);
        this.allFields = buds;
        this.fields = buds;
        if (buds !== undefined) {
            for (let bud of buds) this.coll[bud.id] = bud;
        }
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

    constructor(editing: BudsEditing, bin: EntityBin, buds: BizBud[]) {
        super(editing);
        this.entityBin = bin;
        if (bin === undefined) debugger;
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
    clearValue(bud: BizBud, binRow: BinRow): void {
        let binBud = this.coll[bud.id];
        if (binBud === undefined) {
            debugger; // binRow.buds[bud.id] = value;
            return;
        }
        binBud.setValue(binRow, undefined);
    }
    setBudValue(bud: BizBud, binRow: BinRow, value: any) {
        let binBud = this.coll[bud.id];
        if (binBud === undefined) {
            debugger; // binRow.buds[bud.id] = value;
            return;
        }
        if (value === undefined) {
            let a = 1;
        }
        binBud.setValue(binRow, value);
    }
}

export class BinDivBuds extends BinRowValuesTool {
    readonly binDiv: BinDiv;
    keyField: BizBud;

    constructor(editing: BudsEditing, binDiv: BinDiv) {
        const { buds, key } = binDiv;
        super(editing, binDiv.entityBin, buds);
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
    readonly onPicks: { [bud: number]: BinPick } = {};
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
    directly: boolean;
    primeBuds: BizBud[];

    // 在代码界面上显示需要。本entity引用的entities
    override getRefEntities(arrEntity: Entity[]) {
        if (this.binPicks !== undefined) {
            for (let pick of this.binPicks) {
                this.getSubs(arrEntity, pick);
            }
        }
        this.getSubs(arrEntity, this.rearPick);
        for (let i in this.onPicks) {
            this.getSubs(arrEntity, this.onPicks[i]);
        }
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
            case ':': this.primeBuds = val; break;
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
            case BizPhraseType.fork:
                let pickSpec = pickID = new PickSpec(this.biz, id, pickName, this);
                pickSpec.from = entityID as EntityFork;
                pickSpec.baseParam = atomParams?.base;
                break;
        }
        if (ui !== undefined) {
            if (ui.caption === undefined) {
                ui.caption = caption;
            }
        }
        pickID.ui = ui;
        this.binPicks.push(pickID);
    }

    private buildPick(v: any): BinPick {
        const { id, name, from, caption, params, hidden, on } = v;
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
            pick.from = entity as EntityFork;
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
        const buildPickOptions = () => {
            let pick = new PickOptions(this.biz, id, name, this);
            pick.from = entity as EntityOptions;
            return pick;
        }
        switch (bizPhraseType) {
            default: binPick = undefined; break;
            case BizPhraseType.atom: binPick = buildPickAtom(); break;
            case BizPhraseType.fork: binPick = buildPickSpec(); break;
            case BizPhraseType.query: binPick = buildPickQuery(); break;
            case BizPhraseType.pend: binPick = buildPickPend(); break;
            case BizPhraseType.options: binPick = buildPickOptions(); break;
        }
        if (on !== undefined) {
            binPick.on = this.budColl[on];
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
        if (atom !== undefined) {
            input = new BinInputAtom(this.biz, id, name, undefined, this);
        }
        else if (spec !== undefined || spec === undefined) {
            // spec === undefined 就是自动选择
            input = new BinInputFork(this.biz, id, name, undefined, this);
        }
        input.build(v);
        return input;
    }

    private setDirectly(bizBud: BizBud, required?: boolean) {
        if (this.directly === false) return;
        if (bizBud.required === true || required === true) {
            if (bizBud.valueSet === undefined) this.directly = false;
        }
    }

    scan() {
        super.scan();
        this.directly = true;
        if (this.i !== undefined) {
            this.i = this.buildBudPickable(this.i as any);
            this.i.onForm = false;
            this.biz.addBudIds(this.i);
        }
        if (this.iBase !== undefined) {
            this.iBase = this.buildAtomBud(this.iBase as any);
            this.iBase.onForm = false;
        }
        if (this.x !== undefined) {
            this.x = this.buildBudPickable(this.x as any);
            this.x.onForm = false;
            this.biz.addBudIds(this.x);
        }
        if (this.xBase !== undefined) {
            this.xBase = this.buildAtomBud(this.xBase as any);
            this.xBase.onForm = false;
        }
        if (this.binPicks !== undefined) {
            this.binPicks = this.binPicks.map(v => this.buildPick(v as any));
            let binPicks: BinPick[] = [];
            let rearPick: BinPick;
            for (let pick of this.binPicks) {
                const { on } = pick;
                if (on !== undefined) {
                    this.onPicks[on.id] = pick;
                }
                else {
                    binPicks.push(pick);
                    rearPick = pick;
                }
            }
            if (rearPick !== undefined) {
                binPicks.pop();
            }
            this.binPicks = binPicks;
            this.rearPick = rearPick;
        }
        let divSchema = this.binDivRoot;
        this.binDivRoot = new BinDiv(this, undefined);
        this.divLevels = 0;
        this.scanDiv(this.binDivRoot as any, divSchema);
        this.scanForkBase();
        this.primeBuds = this.idArrToBudArr(this.primeBuds as unknown as number[]);
    }

    private scanForkBase() {
        for (let bud of this.buds) {
            const { budDataType } = bud;
            if (budDataType.type === EnumBudType.fork) {
                let bdt = budDataType as BudFork;
                const { base } = bdt;
                if (typeof base === 'number') {
                    bdt.base = this.biz.budFromId(base as unknown as number);
                }
            }
        }
    }

    private scanDiv(binDiv: BinDiv, divSchema: any) {
        let { inputs, div: subDivSchema, buds, ui, key, format } = divSchema;
        binDiv.ui = ui;
        // binDiv.inputs = 
        this.scanInputs(binDiv, inputs);
        // binDiv.buds = 
        this.scanBinBuds(binDiv, buds);
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
        binDiv.binDivBuds = new BinDivBuds(undefined, binDiv);
        if (subDivSchema !== undefined) {
            ++this.divLevels;
            let subBinDiv = binDiv.subBinDiv = new BinDiv(this, binDiv);
            this.scanDiv(subBinDiv, subDivSchema);
        }
        else if (this.pivot !== undefined) {
            this.pivot = binDiv;
        }
    }

    private scanInputs(binDiv: BinDiv, inputs: any[]) {
        if (inputs === undefined) return;
        binDiv.inputs = inputs.map(v => {
            let input = this.buildInput(v as any);
            input.entityPend = this.pend;
            return input;
        });
    }

    private scanBinBuds(binDiv: BinDiv, buds: any[]) {
        if (buds === undefined) return;
        let ret: BizBud[] = [];
        for (let bud of buds) {
            let bizBud: BizBud;
            let required: boolean = undefined;
            let { iType, xType } = binDiv;
            switch (bud) {
                default: bizBud = this.budColl[bud]; break;
                case 'value': bizBud = this.value; required = true; break;
                case 'price': bizBud = this.price; break;
                case 'amount': bizBud = this.amount; break;
                case 'i':
                    bizBud = this.i; required = true;
                    if (iType !== undefined) iType = IXType.both;
                    else iType = (binDiv.hasIBase() === true) ? IXType.sub : IXType.me;
                    break;
                case '.i':
                    bizBud = this.iBase;
                    if (iType !== undefined) iType = IXType.both;
                    else iType = IXType.base;
                    break;
                case 'x':
                    bizBud = this.x; required = true;
                    if (xType !== undefined) xType = IXType.both;
                    else xType = (binDiv.hasXBase() === true) ? IXType.sub : IXType.me;
                    break;
                case '.x':
                    bizBud = this.xBase;
                    if (xType !== undefined) xType = IXType.both;
                    else xType = IXType.base;
                    break;
            }
            binDiv.iType = iType;
            binDiv.xType = xType;
            if (bizBud === undefined) debugger;
            ret.push(bizBud);
            this.setDirectly(bizBud, required);
        }
        binDiv.buds = ret;
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
    's', 'si', 'sx', 'svalue', 'sprice', 'samount', 'sheet'
    , 'bin', 'i', 'x', 'value', 'price', 'amount', 'iBase', 'xBase'
    , 'pendvalue', 'origin', 'pend'
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
