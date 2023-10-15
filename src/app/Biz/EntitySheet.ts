import { BizBud, EnumBudType } from "./BizBud";
import { Entity, PropPend } from "./Entity";

export class EntityBin extends Entity {
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
            case 'i':
                this.i = val; // this.fromPickable(val);
                // this.iCaption = getPickableCaption(this.i);
                break;
            case 'x':
                this.x = val; // this.fromPickable(val);
                // this.xCaption = getPickableCaption(this.x);
                break;
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
        const { id, name, caption } = prop;
        let bud = new BizBud(this.biz, id, name, EnumBudType.pick, this);
        bud.caption = caption;
        bud.budDataType.fromSchema(prop);
        bud.scan();
        return bud;
    }

    scan() {
        super.scan();
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
    /*
    protected fromStates(states: any[]) {

    }
    */
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
