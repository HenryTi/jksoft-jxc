import { BizBud } from "./BizBud";
import { Entity } from "./Entity";

export class EntityQuery extends Entity {
    asc: 'asc' | 'desc';
    params: BizBud[];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'asc': this.asc = val; break;
            case 'params': this.params = val; break;
        }
    }
}
