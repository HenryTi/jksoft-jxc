import { BizBud, EnumBudType } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom, EntityID, EntityDuo } from "./EntityAtom";
import { EntityBook } from "./EntityTitle";

export class ReportList extends BizBud {
    atom: EntityID;
}

export enum ReportJoinType { x = 1, to = 2 };
export interface ReportJoin {
    type: ReportJoinType;
    entity: Entity;
}

export interface ReportTitle {
    caption: string;
    entity: EntityBook;
    bud: BizBud;
}
export class EntityReport extends Entity {
    title: ReportTitle[];
    from: EntityAtom | EntityDuo;
    joins: ReportJoin[];
    lists: ReportList[];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'title':
            case 'book': this.fromTitle(val); break;
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
        this.from = this.biz.entities[val] as EntityAtom | EntityDuo;
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
            let { ui } = r;
            if (ui !== undefined) {
                ui.caption = caption;
            }
            else {
                r.ui = { caption };
            }
            r.atom = this.biz.entities[atom] as EntityID;
            return r;
        });
    }

    scan() {
        super.scan();
        for (let t of this.title) {
            t.bud = t.entity.budColl[t.bud as any];
        }
    }
}
