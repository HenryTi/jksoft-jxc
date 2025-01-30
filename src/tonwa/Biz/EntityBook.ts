import { Entity } from "./Entity";
import { EntityID } from "./EntityAtom";

export class EntityBook extends Entity {
    i: EntityID;

    override fromSchema(schema: any) {
        super.fromSchema(schema);
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'i': this.i = val; break;
        }
    }

    override scan() {
        super.scan();
        if (this.i !== undefined) {
            this.i = this.biz.entities[this.i as unknown as string] as EntityID;
        }
    }
}
