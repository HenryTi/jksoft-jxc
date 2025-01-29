import { EntityAtom } from "./EntityAtom";
import { Entity } from "./Entity";

export class EntityIn extends Entity {
}

export class EntityOut extends Entity {
}

export interface IOAppID {
    id: number;
    name: string;
    caption: string;
    atoms: EntityAtom[];
}

export class EntityIOApp extends Entity {
    IDs: IOAppID[];
    ins: any[];
    outs: any[];

    protected override fromSwitch(i: string, val: any): void {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'IDs': this.IDs = this.buildIOAppIDs(val); break;
            case 'ins': this.ins = val; break;
            case 'outs': this.outs = val; break;
        }
    }

    private buildIOAppIDs(val: any[]) {
        let ret: IOAppID[] = val.map(v => {
            const { id, atoms, caption, name } = v;
            return {
                id,
                caption,
                name,
                atoms: (atoms as number[]).map(id => this.biz.entityFromId<EntityAtom>(id)),
            }
        });
        return ret;
    }
}

export class EntityIOSite extends Entity {
    tie: EntityAtom;
    apps: EntityIOApp[];

    protected override fromSwitch(i: string, val: any): void {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'tie': this.tie = this.biz.entityFromId(val); break;
            case 'apps': this.apps = (val as number[]).map(v => this.biz.entityFromId(v)); break;
        }
    }
}