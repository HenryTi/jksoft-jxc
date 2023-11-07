import { Entity } from "./Entity";
import { EntityAtomID } from "./EntityAtom";

export interface TieField {
    caption: string;
    atoms: EntityAtomID[];
}

export class EntityTie extends Entity {
    i: TieField;
    x: TieField;
    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'i': this.i = this.fromTieField(val); break;
            case 'x': this.x = this.fromTieField(val); break;
        }
    }

    private fromTieField(val: any) {
        let caption: string = val.caption;
        let atoms: number[] = val.atoms;
        return {
            caption,
            atoms: atoms.map(v => this.biz.entityFromId(v) as EntityAtomID)
        };
    }
}
