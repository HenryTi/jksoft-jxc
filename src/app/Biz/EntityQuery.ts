import { Entity } from "./Entity";

export class EntityQuery extends Entity {
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
        }
    }
}
