import { IxField } from "./EntityAtom";
import { Entity } from "./Entity";

export class EntityTie extends Entity {
    i: IxField;
    x: IxField;
    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'i': this.i = this.fromIxField(val); break;
            case 'x': this.x = this.fromIxField(val); break;
        }
    }
}
