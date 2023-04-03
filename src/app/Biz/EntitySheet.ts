import { Entity } from "./Entity";

export class EntitySheet extends Entity {
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'details': this.fromDetails(val); break;
            case 'states': this.fromStates(val); break;
        }
    }

    protected fromDetails(details: any[]) {

    }

    protected fromStates(states: any[]) {

    }
}
