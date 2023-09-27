import { BizBud } from "./BizBud";
import { Entity, Pickable, RefEntity, getPickableCaption } from "./Entity";

export class EntityMain extends Entity {
    target: Pickable;
    targetCaption: string;

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'target':
                this.target = this.fromPickable(val);
                this.targetCaption = getPickableCaption(this.target);
                break;
        }
    }
}

export class EntityDetail extends Entity {
    main: EntityMain;
    item: Pickable;
    itemCaption: string;
    itemX: Pickable;
    itemXCaption: string;
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
            case 'main': this.fromMain(val); break;
            case 'item':
                this.item = this.fromPickable(val);
                this.itemCaption = getPickableCaption(this.item);
                break;
            case 'itemx':
                this.itemX = this.fromPickable(val);
                this.itemXCaption = getPickableCaption(this.itemX);
                break;
            case 'pend': this.fromPend(val); break;
            case 'value': this.fromValue(val); break;
            case 'price': this.fromPrice(val); break;
            case 'amount': this.fromAmount(val); break;
        }
    }

    private fromMain(main: any) {
        this.main = this.biz.entities[main] as EntityMain;
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
    readonly details: {
        detail: EntityDetail;
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
        this.main = this.biz.entities[main] as EntityMain;
    }

    protected fromDetails(details: any[]) {
        for (let { detail: name, caption } of details) {
            this.details.push({
                detail: this.biz.entities[name] as EntityDetail,
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
