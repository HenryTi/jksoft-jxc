import { Biz } from "./Biz";
import { BizBud } from "./BizBud";
import { BudGroup, BudGroups, Entity } from "./Entity";
import { EntityAtomID } from "./EntityAtom";

export class AtomsBuilder {
    private readonly biz: Biz;
    private readonly selfs: { [entity: number]: EntitySelf };

    constructor(biz: Biz) {
        this.biz = biz;
        this.selfs = {};
    }

    initBuds(entity: Entity, buds: BizBud[]) {
        let self = this.self(entity);
        self.initBuds(buds);
    }

    initBudGroups(entity: Entity, budGroups: BudGroups) {
        let entitySelf = this.self(entity);
        entitySelf.initBudGroups(budGroups);
    }

    initSuperClass(entity: Entity, extendsId: number) {
        let self = this.self(entity);
        return self.superClass = this.biz.entityFromId(extendsId) as EntityAtomID;
    }

    getAncestorSelfs(entity: EntityAtomID) {
        const ancestors: EntitySelf[] = [];
        for (let p = this.self(entity); p !== undefined;) {
            ancestors.unshift(p);
            p = this.self(p.superClass);
        }
        return ancestors;
    }

    self(entity: Entity) {
        if (entity === undefined) return;
        const { id } = entity;
        let self = this.selfs[id];
        if (self === undefined) {
            self = new EntitySelf(entity);
            this.selfs[id] = self;
        }
        return self;
    }

    buildRootAtoms() {
        for (let atom of this.biz.atoms) {
            let { superClass: _extends } = this.self(atom);
            if (_extends !== undefined) continue;
            this.biz.atomRoots.push(atom);
        }
    }
}

export class EntitySelf {
    readonly entity: Entity;
    superClass: EntityAtomID;
    buds: BizBud[];
    groups: BudGroups;
    readonly groupColl: { [name: string]: BudGroup }; // name is the BudGroup name in Entity
    constructor(entity: Entity) {
        this.entity = entity;
        this.groupColl = {};
    }

    initBuds(buds: BizBud[]) {
        this.buds = [...buds];
    }

    initBudGroups(groups: BudGroups) {
        if (groups === undefined) return;
        this.groups = this.entity.cloneBudGroups(groups);
        for (let group of groups.arr) {
            this.groupColl[group.groupName] = group;
        }
    }
}
