import { Entity } from "./Entity";

export class EntityAtom extends Entity {
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'states': this.fromStates(val); break;
        }
    }

    protected fromStates(states: any[]) {

    }
}

