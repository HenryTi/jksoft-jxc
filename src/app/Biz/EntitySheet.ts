import { Entity } from "./Entity";

export class EntityMain extends Entity {
}

export class EntityDetail extends Entity {
    main: EntityMain;

    protected fromMain(main: any) {
        this.main = this.biz.entities[main] as EntityMain;
    }
}

export class EntityPend extends Entity {
    detail: EntityDetail;
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'detail': this.fromDetail(val); break;
        }
    }

    protected fromDetail(detail: any) {
        this.detail = this.biz.entities[detail] as EntityDetail;
    }
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

    protected fromMain(main: any) {
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
