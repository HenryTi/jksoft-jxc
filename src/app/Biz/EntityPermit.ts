import { Entity } from "./Entity";

export class EntityPermit extends Entity {
    items: string[];
    permits: string[];
    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'items': this.items = val; break;
            case 'permits': this.permits = val; break;
        }
    }
}

export class EntityRole extends Entity {

}
