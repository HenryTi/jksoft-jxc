import { BizPhraseType } from "uqs/UqDefault";
import { Biz } from "./Biz";
import { BizBud, EnumBudType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom, EntitySpec } from "./EntityAtom";
import { EntityQuery } from "./EntityQuery";

export interface PickParam {
    name: string;
    bud: string;
    prop: string;       // prop of bud
}

export abstract class PickBase {
    bizPhraseType: BizPhraseType;
    abstract getSubClasses(): Entity[];
}
export class PickQuery extends PickBase {
    query: EntityQuery;
    getSubClasses(): Entity[] { return [this.query]; }
}
export class PickAtom extends PickBase {
    from: EntityAtom[];
    getSubClasses(): Entity[] { return; }
}
export class PickSpec extends PickBase {
    from: EntitySpec;
    getSubClasses(): Entity[] { return; }
}
export class PickPend extends PickBase {
    from: EntityPend;
    getSubClasses(): Entity[] { return [this.from]; }
}

export class PickInput extends PickBase {
    getSubClasses(): Entity[] { return; }
}

export class BinPick extends BizBud {
    readonly bin: EntityBin;
    pickParams: PickParam[];
    pick: PickBase;
    constructor(biz: Biz, id: number, name: string, bin: EntityBin) {
        super(biz, id, name, EnumBudType.pick, bin);
        this.bin = bin;
    }
}

export class EntityBin extends Entity {
    picks: BinPick[];
    i: BizBud;
    x: BizBud;
    pend: EntityPend;
    input: PickInput;
    value: BizBud;
    price: BizBud;
    amount: BizBud;

    getSubClasses(): Entity[] {
        let ret: Entity[] = [];
        for (let pick of this.picks) {
            let subs = pick.pick.getSubClasses();
            if (subs !== undefined) {
                ret.push(...subs);
            }
        }
        return ret;
    }

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'picks': this.picks = val; break;
            case 'i': this.i = val; break;
            case 'x': this.x = val; break;
            case 'pend': this.fromPend(val); break;
            case 'value': this.fromValue(val); break;
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
        return bud;
    }

    private buildPick(v: any): BinPick {
        const { id, name, from, caption, params } = v;
        let ret = new BinPick(this.biz, id, name, this);
        ret.pickParams = params;
        ret.ui = { caption };
        let arr = (from as string[]).map(v => this.biz.entities[v]);
        let entity = arr[0];
        if (entity === undefined) {
            let pickBase = buildPickInput();
            ret.pick = pickBase;
            this.input = pickBase;
            return ret;
        }
        let { bizPhraseType } = entity;
        let pickBase: PickBase;
        function buildPickAtom() {
            let pick = new PickAtom();
            pick.from = arr as EntityAtom[];
            return pick;
        }
        function buildPickSpec() {
            let pick = new PickSpec();
            pick.from = entity as EntitySpec;
            return pick;
        }
        function buildPickQuery() {
            let pick = new PickQuery();
            pick.query = entity as EntityQuery;
            return pick;
        }
        function buildPickPend() {
            let pick = new PickPend();
            pick.from = entity as EntityPend;
            return pick;
        }
        function buildPickInput() {
            let pick = new PickInput();
            return pick
        }
        switch (bizPhraseType) {
            default: pickBase = buildPickInput(); break;
            case BizPhraseType.atom: pickBase = buildPickAtom(); break;
            case BizPhraseType.spec: pickBase = buildPickSpec(); break;
            case BizPhraseType.query: pickBase = buildPickQuery(); break;
            case BizPhraseType.pend: pickBase = buildPickPend(); break;
        }
        pickBase.bizPhraseType = bizPhraseType;
        ret.pick = pickBase;
        return ret;
    }

    scan() {
        super.scan();
        if (this.picks !== undefined) {
            this.picks = this.picks.map(v => this.buildPick(v as any));
        }
        if (this.i !== undefined) {
            this.i = this.buildBudPickable(this.i as any);
        }
        if (this.x !== undefined) {
            this.x = this.buildBudPickable(this.x as any);
        }
    }
}

const predefined = [
    's', 'si', 'sx', 'svalue', 'sprice', 'samount'
    , 'i', 'x', 'value', 'price', 'amount'
    , 'pendvalue'
];

export class EntityPend extends Entity {
    predefined: { [name: string]: BizBud };
    i: BizBud;
    x: BizBud;
    params: BizBud[];
    private cols: BizBud[];

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                if (predefined.includes(i) === true) break;
                super.fromSwitch(i, val); break;
            case 'predefined':
                this.predefined = val; break;
            case 'params':
                this.params = val; break;
            case 'cols':
                this.cols = val; break;
            case 'i':
                this.i = val; break;
            case 'x':
                this.x = val; break;
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
    main: EntityBin;
    coreDetail: EntityBin;
    readonly details: {
        bin: EntityBin;
        caption: string;
    }[] = [];

    getSubClasses(): Entity[] {
        let ret: Entity[] = [];
        if (this.main !== undefined) ret.push(this.main);
        ret.push(...this.details.map(v => v.bin));
        return ret;
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'main': this.fromMain(val); break;
            case 'details': this.fromDetails(val); break;
        }
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
}
