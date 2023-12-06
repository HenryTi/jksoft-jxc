import { Entity } from "./Entity";

export interface PermitItem {
    name: string;
    caption: string;
    phrase: string;
}

export class EntityPermit extends Entity {
    items: PermitItem[];
    permits: EntityPermit[];
    private permitNames: string[]
    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'items': this.items = val; break;
            case 'permits': this.permitNames = val; break;
        }
    }

    scan() {
        const { entities } = this.biz;
        this.permits = this.permitNames.map(v => entities[v] as EntityPermit);
        this.permitNames = undefined;
    }
}

export class EntityRole extends Entity {

}
