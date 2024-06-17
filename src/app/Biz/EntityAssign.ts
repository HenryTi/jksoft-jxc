import { BizBud } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom } from "./EntityAtom";

export class EntityAssign extends Entity {
    atoms: EntityAtom[];
    titles: BizBud[];

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'atom':
                this.fromAtom(val);
                break;
            case 'title':
            case 'book':
                this.fromTitle(val); break;
        }
    }

    private fromAtom(val: any) {
        this.atoms = (val as string[]).map(v => this.biz.entities[v] as EntityAtom);
    }

    private fromTitle(val: any) {
        this.titles = val;
    }

    scan(): void {
        super.scan();
        this.titles = (this.titles as unknown as [number, number][]).map(
            ([t0, t1]) => {
                let bizEntity = this.biz.entityFromId(t0);
                let ret = bizEntity.budColl[t1];
                return ret;
            }
        );
    }
}
