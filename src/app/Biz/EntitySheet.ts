import { BizBud, BizProp } from "./BizBud";
import { Entity } from "./Entity";

export class EntityMain extends Entity {
    target: BizBud;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'target': this.fromTarget(val); break;
        }
    }

    private fromTarget(prop: any) {
        this.target = this.fromProp(prop);
    }
}

export class EntityDetail extends Entity {
    main: EntityMain;
    item: BizBud;
    pend: EntityPend;
    value: BizBud;
    price: BizBud;
    amount: BizBud;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'main': this.fromMain(val); break;
            case 'item': this.fromItem(val); break;
            case 'pend': this.fromPend(val); break;
            case 'value': this.fromValue(val); break;
            case 'price': this.fromPrice(val); break;
            case 'amount': this.fromAmount(val); break;
        }
    }

    private fromMain(main: any) {
        this.main = this.biz.entities[main] as EntityMain;
    }

    private fromItem(prop: any) {
        this.item = this.fromProp(prop);
    }

    private fromPend(pend: any) {
        this.pend = this.biz.entities[pend] as EntityPend;
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
}

export class EntityPend extends Entity {
    // detail: EntityDetail;
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            // case 'detail': this.fromDetail(val); break;
        }
    }
    /*
    protected fromDetail(detail: any) {
        // this.detail = this.biz.entities[detail] as EntityDetail;
    }
    */
}

export interface DetailAct {
    actName: string;
    detail: EntityDetail;
    fromPend: EntityPend;
}

export class EntitySheet extends Entity {
    main: EntityMain;
    readonly detailActs: DetailAct[] = [];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'main': this.fromMain(val); break;
            case 'details': this.fromDetails(val); break;
            case 'states': this.fromStates(val); break;
            case 'acts': this.fromActs(val); break;
        }
    }

    private fromMain(main: any) {
        this.main = this.biz.entities[main] as EntityMain;
    }

    protected fromDetails(details: any[]) {

    }

    protected fromStates(states: any[]) {

    }

    protected fromActs(acts: any[]) {
        for (const act of acts) {
            const { name, fromPend, detail } = act;
            this.detailActs.push({
                actName: name,
                detail: this.biz.entities[detail] as EntityDetail,
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
