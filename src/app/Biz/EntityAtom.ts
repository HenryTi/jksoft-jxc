import { EntitySelf } from "./AtomsBuilder";
import { IxField } from "./BizBase";
import { BizBud } from "./BizBud";
import { BudGroup, Entity } from "./Entity";

export abstract class EntityAtomID extends Entity {
    readonly subClasses: EntityAtomID[] = [];
    uniques: string[];

    getRefEntities(arrEntity: Entity[]) { arrEntity.push(... this.subClasses); }

    getUniques(): string[] {
        let us = [...(this.uniques ?? [])];
        for (let sc of this.subClasses) {
            us.push(...sc.uniques ?? []);
        }
        return us;
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'extends': this.fromExtends(val); break;
            case 'uniques': this.uniques = val; break;
        }
    }

    protected override buildBudsGroups() {
        const ancestorSelfs = this.biz.atomBuilder.getAncestorSelfs(this);
        const ancestorSelfs0 = ancestorSelfs[0];
        this.buildBudsGroupsFromSelf(ancestorSelfs0);

        let len = ancestorSelfs.length;
        for (let i = 1; i < len; i++) {
            let p = ancestorSelfs[i];
            const { buds } = p;
            if (buds !== undefined) {
                this.buds.push(...buds);
            }
            this.mergeBudGroups(p);
        }
    }

    private mergeBudGroups(entitySelf: EntitySelf) {
        const { groups, groupColl } = entitySelf;
        if (groups === undefined) {
            if (this.budGroups !== undefined) {
                const { home } = this.budGroups;
                if (home === undefined) debugger;
                const { buds } = home;
                if (buds !== undefined) {
                    let { buds: selfBuds } = entitySelf;
                    if (selfBuds !== undefined) {
                        buds.push(...selfBuds);
                    }
                }
            }
            return;
        }
        if (this.budGroups === undefined) {
            this.budGroups = this.cloneBudGroups(groups);
        }
        const { home, must, arr } = this.budGroups;
        this.mergeBudGroup(home, groups.home);
        this.mergeBudGroup(must, groups.must);
        for (let g of arr) {
            const { groupName } = g;
            let group = groupColl[groupName];
            if (group === undefined) {
                group = this.cloneBudGroup(g);
                groupColl[groupName] = group;
                arr.push(group);
            }
            else {
                this.mergeBudGroup(group, g);
            }
        }
    }

    private mergeBudGroup(to: BudGroup, from: BudGroup) {
        to.buds.push(...from.buds);
    }

    protected fromExtends(extendsId: number) {
        if (extendsId === undefined) return;
        let superClass = this.biz.atomBuilder.initSuperClass(this, extendsId);
        if (superClass === undefined) debugger;
        superClass.subClasses.push(this);
    }
}

export class EntityAtom extends EntityAtomID {
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
        }
    }
}

export class EntityDuo extends EntityAtomID {
    i: IxField;
    x: IxField;

    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'i': this.i = this.fromIxField(val); break;
            case 'x': this.x = this.fromIxField(val); break;
        }
    }
}

abstract class EntityAtomIDWithBase extends EntityAtomID {
    base: EntityAtomID;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'base': this.base = val; break;
        }
    }
}

export class EntitySpec extends EntityAtomIDWithBase {
    readonly keyColl: { [key: string]: BizBud; } = {};
    readonly keys: BizBud[] = [];
    ix: boolean;    // 服务器端对应 isIxBase。如果true，不能临时录入，只能选择。

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'keys': this.fromKeys(val); break;
            case 'ix': this.ix = val; break;
        }
    }

    protected fromKeys(keys: any[]) {
        for (let key of keys) {
            let { id, name, dataType } = key;
            let bizProp = new BizBud(this.biz, id, name, dataType, this);
            let { budDataType } = bizProp;
            if (budDataType === undefined) {
                debugger;
                continue;
            }
            budDataType.fromSchema(key);
            bizProp.fromSchema(key);
            this.keyColl[bizProp.id] = bizProp;
            // this.keyColl[bizProp.phrase] = bizProp;
            this.keys.push(bizProp);
        }
    }

    scan() {
        super.scan();
        for (let bud of this.keys) {
            bud.scan();
        }
    }

    getSpecValues(specValue: any): string {
        if (!specValue) return '';
        let ret: string[] = [];
        for (let bud of this.keys) {
            ret.push(specValue[bud.name] ?? '');
        }
        for (let bud of this.buds) {
            ret.push(specValue[bud.name] ?? '');
        }
        let s = ret.join(String.fromCharCode(12));
        return s;
    }

    fromSpecValues(values: string): any {
        let ret: { [key: string]: any } = {};
        let parts = values.split(String.fromCharCode(12));
        let i = 0;
        for (let bud of this.keys) {
            ret[bud.name] = parts[i++];
        }
        for (let bud of this.buds) {
            ret[bud.name] = parts[i++];
        }
        return ret;
    }
}

export class EntityPick extends Entity {
    atoms: EntityAtom[];
    specs: EntitySpec[];
    protected override fromSwitch(i: string, val: any) {
        const { entities } = this.biz;
        function fromArr(items: string[]) {
            return items.map(v => entities[v] as any);
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'atoms': this.atoms = fromArr(val); break;
            case 'specs': this.specs = fromArr(val); break;
        }
    }

    scan() {
        super.scan();
        // 如果前面 atom.uom = true, 后面自动加上 SpecUom。
        let len = this.specs.length;
        for (let i = 0; i < len; i++) {
            let spec = this.specs[i];
            if (spec.name === 'specuom') {
                this.specs.splice(i, 1);
                break;
            }
        }
    }
}
