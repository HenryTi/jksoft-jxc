import { BizBud } from "./BizBud";
import { Entity } from "./Entity";

export class EntityQuery extends Entity {
    asc: 'asc' | 'desc';
    ban: string | true;
    params: BizBud[];
    private cols: [number, number][];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'asc': this.asc = val; break;
            case 'params': this.params = (val as any[]).map(v => this.fromProp(v)); break;
            case 'ban': this.ban = val; break;
            case 'cols': this.cols = val; break;
        }
    }

    scan(): void {
        super.scan();
        for (let col of this.cols) {
            let [eId, bId] = col;
            let entity = this.biz.entityIds[eId];
            if (entity === undefined) {
                continue;
            }
            let bud = entity.buds[bId];
            if (bud === undefined) {
                continue;
            }
            this.buds[bud.id] = bud;
        }
    }
}

