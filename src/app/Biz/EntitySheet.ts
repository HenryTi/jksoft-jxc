import { BizPhraseType } from "uqs/UqDefault";
import { Biz } from "./Biz";
import { BizBud, EnumBudType } from "./BizBud";
import { Entity, PropPend } from "./Entity";
import { EntityAtom, EntitySpec } from "./EntityAtom";
import { EntityQuery } from "./EntityQuery";


export interface PickParam {
    name: string;
    bud: string;
    prop: string;       // prop of bud
}
export abstract class PickBase {
    bizPhraseType: BizPhraseType;
}
export class PickQuery extends PickBase {
    query: EntityQuery;
}
export class PickAtom extends PickBase {
    from: EntityAtom[];
}
export class PickSpec extends PickBase {
    from: EntitySpec;
}
export class PickPend extends PickBase {
    from: EntityPend;
}

export class BinPick extends BizBud {
    readonly bin: EntityBin;
    param: PickParam[];
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
    pend: PropPend;
    value: BizBud;
    price: BizBud;
    amount: BizBud;

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
        let { caption, entity, search } = pend;
        this.pend = {
            caption,
            entity: this.biz.entities[entity] as EntityPend,
            search,
        };
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
        // bud.caption = caption;
        bud.budDataType.fromSchema(prop);
        bud.scan();
        return bud;
    }

    private buildPick(v: any): BinPick {
        const { id, name, param, from, caption } = v;
        let ret = new BinPick(this.biz, id, name, this);
        ret.ui = { caption };
        ret.param = param;
        let arr = (from as string[]).map(v => this.biz.entities[v]);
        let entity = arr[0];
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
        switch (bizPhraseType) {
            default: debugger;
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
    's', 'si', 'sx', 'svalue', 'sprice', 'samount',
    'i', 'x', 'value', 'price', 'amount'
];

export class EntityPend extends Entity {
    predefined: { [name: string]: BizBud };

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                if (predefined.includes(i) === true) break;
                super.fromSwitch(i, val); break;
            case 'predefined':
                this.predefined = val; break;
            /*
            case 's': this.s = val; break;
            case 'si': this.si = val; break;
            case 'sx': this.sx = val; break;
            case 'svalue': this.svalue = val; break;
            case 'sprice': this.sprice = val; break;
            case 'samount': this.samount = val; break;
            case 'i': this.i = val; break;
            case 'x': this.x = val; break;
            case 'value': this.value = val; break;
            case 'price': this.price = val; break;
            case 'amount': this.amount = val; break;
            */
        }
    }
}

export interface DetailAct {
    actName: string;
    detail: EntityBin;
    fromPend: EntityPend;
}

export class EntitySheet extends Entity {
    main: EntityBin;
    coreDetail: EntityBin;
    readonly details: {
        bin: EntityBin;
        caption: string;
    }[] = [];
    // to be removed
    readonly detailActs: DetailAct[] = [];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'main': this.fromMain(val); break;
            case 'details': this.fromDetails(val); break;
            // case 'states': this.fromStates(val); break;
            case 'acts': this.fromActs(val); break;
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

    protected fromActs(acts: any[]) {
        for (const act of acts) {
            const { name, fromPend, detail } = act;
            this.detailActs.push({
                actName: name,
                detail: this.biz.entities[detail] as EntityBin,
                fromPend: this.biz.entities[fromPend] as EntityPend,
            });
        }
    }

    getAct(detailName: string, actName: string): DetailAct {
        for (let act of this.detailActs) {
            let { actName: nAct, detail } = act;
            if (nAct === actName && detail.name === detailName) {
                return act;
            }
        }
    }
}
