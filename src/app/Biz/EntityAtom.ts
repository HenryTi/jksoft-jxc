import { EntitySelf } from "./AtomsBuilder";
import { IxField } from "./BizBase";
import { BizBud } from "./BizBud";
import { BudGroup, Entity } from "./Entity";

export abstract class EntityID extends Entity {
    readonly subClasses: EntityID[] = [];
    superClass: EntityID;
    fork: EntityFork;
    titleBuds: BizBud[];
    primeBuds: BizBud[];
    uniques: string[];

    getRefEntities(arrEntity: Entity[]) { arrEntity.push(... this.subClasses); }

    getUniques(): string[] {
        let us = [...(this.uniques ?? [])];
        for (let sc of this.subClasses) {
            us.push(...sc.uniques ?? []);
        }
        return us;
    }

    setFork(fork: EntityFork) {
        this.fork = fork;
    }

    getFork(): EntityFork {
        if (this.fork !== undefined) return this.fork;
        return this.superClass?.getFork();
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case ':&': this.titleBuds = val; break;
            case ':': this.primeBuds = val; break;
            case 'extends': this.fromExtends(val); break;
            case 'uniques': this.uniques = val; break;
        }
    }

    /*
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
            for (let bud of buds) bud.scan();
            this.mergeBudGroups(p);
        }
    }
    */

    /*
    scanTitlePrime() {
        const ancestorSelfs = this.biz.atomBuilder.getAncestorSelfs(this);
        // if (ancestorSelfs.length <= 1) return;
        let titleBuds: BizBud[] = [];
        let primeBuds: BizBud[] = [];
        let titleColl: { [id: number]: BizBud } = {};
        let primeColl: { [id: number]: BizBud } = {};
        for (let ancestor of ancestorSelfs) {
            let { _titleBuds: tbs, _primeBuds: pbs } = ancestor.entity as EntityAtom;
            if (tbs !== undefined) {
                for (let tb of tbs) {
                    if (tb === undefined) debugger;
                    let { id } = tb;
                    if (titleColl[id] !== undefined) continue;
                    titleBuds.push(tb);
                    titleColl[id] = tb;
                }
                this.titleBuds = titleBuds;
            }
            if (pbs !== undefined) {
                for (let pb of pbs) {
                    let { id } = pb;
                    if (primeColl[id] !== undefined) continue;
                    primeBuds.push(pb);
                    primeColl[id] = pb;
                }
                this.primeBuds = primeBuds;
            }
        }
    }
    */

    private mergeBudGroupsFromSuperClass() {
        const { budGroups } = this.superClass;
        if (budGroups === undefined) return;
        if (this.budGroups === undefined) {
            let home = new BudGroup(this.biz, 0, '-', undefined);
            home.buds.push(...this.buds);
            this.budGroups = {
                home,
                must: undefined,
                arr: [],
            };
        }
        const { home, must, arr } = this.budGroups;
        this.budGroups.home = this.mergeBudGroup(home, budGroups.home);
        this.budGroups.must = this.mergeBudGroup(must, budGroups.must);
        for (let g of budGroups.arr) {
            const { groupName } = g;
            let group = arr.find(v => v.name === groupName);
            if (group === undefined) {
                arr.push(this.cloneBudGroup(g));
                continue;
            }
            this.mergeBudGroup(group, g);
        }
    }

    private mergeBudGroup(to: BudGroup, from: BudGroup) {
        if (to === undefined) {
            to = new BudGroup(this.biz, from.id, from.name, from.type);
        }
        const { buds: toBuds } = to;
        const { buds: fromBuds } = from;
        if (toBuds === undefined) {
            to.buds = [...fromBuds];
        }
        else if (fromBuds !== undefined) {
            toBuds.push(...fromBuds);
        }
        return to;
    }

    protected fromExtends(extendsId: number) {
        if (extendsId === undefined) return;
        let superClass = this.biz.entityFromId(extendsId) as EntityID; // .atomBuilder.initSuperClass(this, extendsId);
        if (superClass === undefined) debugger;
        superClass.subClasses.push(this);
        this.superClass = superClass;
    }

    protected idArrToBudArr(ids: number[]): BizBud[] {
        if (ids === undefined) return;
        return ids.map(v => this.budColl[v]);
    }

    scan() {
        super.scan();
        this.titleBuds = this.idArrToBudArr(this.titleBuds as unknown as number[]);
        this.primeBuds = this.idArrToBudArr(this.primeBuds as unknown as number[]);
    }

    hierarchy() {
        // this.buildSelf();
        for (let sub of this.subClasses) {
            sub.mergeFromSuperClass();
            sub.hierarchy();
        }
    }

    private mergeFromSuperClass() {
        this.mergeTitleFromSuperClass();
        this.mergePrimeFromSuperClass();
        this.mergeBudGroupsFromSuperClass();
    }

    /*
    private buildSelf() {
        let buds: BizBud[] = [];
        this.mergeTitlePrime(buds, {}, true);
        this.titleBuds = buds;
        buds = [];
        this.mergeTitlePrime(buds, {}, false);
        this.primeBuds = buds;
    }
    */
    private mergeTitleFromSuperClass() {
        this.titleBuds = this.mergeTitlePrime(this.titleBuds, this.superClass.titleBuds);
    }

    private mergePrimeFromSuperClass() {
        this.primeBuds = this.mergeTitlePrime(this.primeBuds, this.superClass.primeBuds);
    }

    private mergeTitlePrime(to: BizBud[], from: BizBud[]): BizBud[] {
        if (to === undefined) {
            if (from === undefined) return;
            return [...from];
        }
        if (from === undefined) return to;
        return [...new Set([...from, ...to])];
    }
}

export class EntityAtom extends EntityID {
    /*
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'fork': this.fromFork(val); break;
        }
    }

    private fromFork(val: any) {
        this.fork = new EntityFork(this.biz, this.id, this.name, 'fork');
        this.fork.fromSchema(val);
    }

    protected override scanBuds(): void {
        super.scanBuds();
        if (this.fork !== undefined) {
            this.fork.scanBudsPublic();
        }
    }
    */
}

export class EntityDuo extends EntityID {
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

export class EntityFork extends EntityID {
    readonly keyColl: { [key: number]: BizBud; } = {};
    readonly keys: BizBud[] = [];
    readonly showKeys: BizBud[] = [];
    readonly showBuds: BizBud[] = [];
    base: EntityID;
    noBud: BizBud;
    exBud: BizBud;
    preset: boolean;    // 如果true，不能临时录入，只能选择。

    getBud(id: number): BizBud {
        let ret = this.keyColl[id];
        if (ret !== undefined) return ret;
        return this.budColl[id];
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'base': this.base = val; break;
            case 'keys': this.fromKeys(val); break;
            case 'preset': this.preset = val; break;
        }
    }

    protected fromKeys(keys: any[]) {
        for (let key of keys) {
            let { id, name, dataType } = key;
            let bizBud = new BizBud(this.biz, id, name, dataType, this);
            let { budDataType } = bizBud;
            if (budDataType === undefined) {
                debugger;
                continue;
            }
            budDataType.fromSchema(key);
            bizBud.fromSchema(key);
            let { ui } = bizBud;
            if (ui === undefined) {
                bizBud.ui = ui = {};
            }
            ui.required = true;
            this.keyColl[bizBud.id] = bizBud;
            this.keys.push(bizBud);
        }
    }

    scanBudsPublic() {
        this.scanBuds();
    }

    protected override scanBuds(): void {
        super.scanBuds();
        const setNoEx = (bud: BizBud) => {
            switch (bud.name) {
                default: return false;
                case 'no': this.noBud = bud; return true;
                case 'ex': this.exBud = bud; return true;
            }
        }
        for (let bud of this.keys) {
            bud.scan();
            if (setNoEx(bud) == true) continue;
            this.showKeys.push(bud);
        }
        for (let bud of this.buds) {
            if (setNoEx(bud) == true) continue;
            this.showBuds.push(bud);
        }
    }

    protected override idArrToBudArr(ids: number[]): BizBud[] {
        if (ids === undefined) return;
        return ids.map(v => {
            let ret = this.budColl[v];
            if (ret === undefined) {
                ret = this.keyColl[v];
            }
            if (ret === undefined) debugger;
            return ret;
        });
    }

    scan() {
        super.scan();
        if (this.base !== undefined) {
            this.base = this.biz.entityFromId(this.base as unknown as number);
            this.base.setFork(this);
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

export class EntityCombo extends EntityID {
    readonly keyColl: { [key: number]: BizBud; } = {};
    readonly keys: BizBud[] = [];

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'keys': this.fromKeys(val); break;
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
            this.keys.push(bizProp);
        }
    }

    protected override scanBuds(): void {
        super.scanBuds();
        for (let bud of this.keys) {
            bud.scan();
        }
    }
}

export class EntityPick extends Entity {
    atoms: EntityAtom[];
    specs: EntityFork[];
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
