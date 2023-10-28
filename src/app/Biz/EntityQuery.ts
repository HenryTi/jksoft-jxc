import { BizBud } from "./BizBud";
import { Entity } from "./Entity";

export class EntityQuery extends Entity {
    asc: 'asc' | 'desc';
    ban: string | true;
    params: BizBud[];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'asc': this.asc = val; break;
            case 'params': this.params = (val as any[]).map(v => this.fromProp(v)); break;
            case 'ban': this.ban = val; break;
        }
    }

    scan(): void {
        super.scan();
    }
}
