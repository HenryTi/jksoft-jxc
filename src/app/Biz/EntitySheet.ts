import { BizBud } from "./BizBud";
import { Entity, RefEntity } from "./Entity";

export class EntityBin extends Entity {
    i: BizBud;
    // iCaption: string;
    x: BizBud;
    // xCaption: string;
    pend: RefEntity<EntityPend>; // EntityPend;
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
        let { caption, entity } = pend;
        this.pend = {
            caption,
            entity: this.biz.entities[entity] as EntityPend,
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

    scan() {
        super.scan();
        this.i?.scan();
        this.x?.scan();
    }
}

export class EntityPend extends Entity {
    s: BizBud;
    si: BizBud;
    sx: BizBud;
    i: BizBud;
    x: BizBud;
    value: BizBud;
    price: BizBud;
    amount: BizBud;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 's': this.s = val; break;
            case 'si': this.si = val; break;
            case 'sx': this.sx = val; break;
            case 'i': this.i = val; break;
            case 'x': this.x = val; break;
            case 'value': this.value = val; break;
            case 'price': this.price = val; break;
            case 'amount': this.amount = val; break;
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
    readonly details: {
        detail: EntityBin;
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
        for (let { detail: name, caption } of details) {
            this.details.push({
                detail: this.biz.entities[name] as EntityBin,
                caption,
            })
        }
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
