import { Entity } from "./Entity";

export class EntityIn extends Entity {
}

export class EntityOut extends Entity {
}

export class EntityIOApp extends Entity {
    IDs: any[];
    ins: any[];
    outs: any[];

    protected override fromSwitch(i: string, val: any): void {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'IDs': this.IDs = val; break;
            case 'ins': this.ins = val; break;
            case 'outs': this.outs = val; break;
        }
    }
}
