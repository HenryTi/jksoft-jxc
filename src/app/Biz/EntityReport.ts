import { BizBud, EnumBudType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtomID } from "./EntityAtom";
import { EntityTitle } from "./EntityTitle";

export class ReportList extends BizBud {
    atom: EntityAtomID;
}

export class EntityReport extends Entity {
    title: {
        entity: EntityTitle;
        bud: BizBud;
    };
    lists: ReportList[];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'title': this.fromTitle(val); break;
            case 'lists': this.fromLists(val); break;
        }
    }

    private fromTitle(val: any) {
        let parts = (val as string).split('.');
        this.title = {
            entity: this.biz.entities[parts[0]],
            bud: parts[1] as any,
        }
    }

    private fromLists(val: any) {
        this.lists = (val as any[]).map(v => {
            const { id, name, caption, atom } = v;
            let r = new ReportList(this.biz, id, name, EnumBudType.none, this);
            r.caption = caption;
            r.atom = this.biz.entities[atom] as EntityAtomID;
            return r;
        });
    }

    scan() {
        this.title.bud = this.title.entity.buds[this.title.bud as any];
    }
}
