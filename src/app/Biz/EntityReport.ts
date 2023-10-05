import { BizBud, EnumBudType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom, EntityAtomID } from "./EntityAtom";
import { EntityTitle } from "./EntityTitle";

export class ReportList extends BizBud {
    atom: EntityAtomID;
}

export enum ReportJoinType { x = 1, to = 2 };
export interface ReportJoin {
    type: ReportJoinType;
    entity: Entity;
}

export class EntityReport extends Entity {
    title: {
        caption: string;
        entity: EntityTitle;
        bud: BizBud;
    }[];
    from: EntityAtom;
    joins: ReportJoin[];
    lists: ReportList[];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'title': this.fromTitle(val); break;
            case 'from': this.fromFrom(val); break;
            case 'joins': this.fromJoins(val); break;
            case 'lists': this.fromLists(val); break;
        }
    }

    private fromTitle(val: any) {
        this.title = (val as any[]).map(v => {
            const { caption, title: [v0, v1] } = v;
            return {
                caption,
                entity: this.biz.entities[v0],
                bud: v1 as any,
            }
        });
    }

    private fromFrom(val: any) {
        this.from = this.biz.entities[val] as EntityAtom;
    }

    private fromJoins(val: any) {
        this.joins = (val as any[]).map(v => {
            const { type, entity } = v;
            return {
                type,
                entity: this.biz.entities[entity],
            };
        });
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
        for (let t of this.title) {
            t.bud = t.entity.buds[t.bud as any];
        }
    }
}
