import { Entity } from "./Entity";
import { EntitySheet } from "./EntitySheet";

export class EntityFlow extends Entity {
    sheets: EntitySheet[];
    memo: string;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'sheets': this.sheets = val; break;
            case 'memo': this.memo = val; break;
        }
    }

    override scan() {
        super.scan();
        if (this.sheets !== undefined) {
            this.sheets = (this.sheets as unknown as number[]).map(v => this.biz.entities[v] as EntitySheet);
        }
    }
}
