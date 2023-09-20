import { BizBud } from "./BizBud";
import { Entity } from "./Entity";
import { EntityOptions } from "./EntityOptions";

abstract class EntityAtomID extends Entity {
    _extends: EntityAtomID;
    readonly children: EntityAtomID[] = [];

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'extends': this.fromExtends(val); break;
        }
    }

    protected override buildBuds() {
        const ancestors: EntityAtomID[] = [];
        for (let p: EntityAtomID = this; p !== undefined; p = p._extends) {
            ancestors.unshift(p);
        }
        let { buds, props } = this;
        for (let p of ancestors) {
            for (let bud of p.selfProps) {
                let { name, phrase } = bud;
                buds[name] = bud;
                buds[phrase] = bud;
                props.push(bud);
            }
            /*
            for (let bud of p.selfAssigns) {
                let { name, phrase } = bud;
                buds[name] = bud;
                buds[phrase] = bud;
                assigns.push(bud);
            }
            */
        }
    }

    protected fromExtends(extendsName: any) {
        if (extendsName === undefined) return;
        let _extends = this._extends = this.biz.entities[extendsName] as EntityAtomID;
        if (_extends === undefined) debugger;
        _extends.children.push(this);
    }
}

export class EntityAtom extends EntityAtomID {
    uom: boolean;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'uom': this.uom = val; break;
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
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'keys': this.fromKeys(val); break;
        }
    }

    protected fromKeys(keys: any[]) {
        for (let key of keys) {
            let { name, dataType } = key;
            let bizProp = new BizBud(this.biz, name, dataType, this);
            let { budDataType } = bizProp;
            if (budDataType === undefined) {
                debugger;
                continue;
            }
            budDataType.fromSchema(key);
            this.keyColl[bizProp.phrase] = bizProp;
            this.keys.push(bizProp);
        }
    }

    getSpecValues(specValue: any): string {
        if (!specValue) return '';
        let ret: string[] = [];
        for (let bud of this.keys) {
            ret.push(specValue[bud.name] ?? '');
        }
        for (let bud of this.props) {
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
        for (let bud of this.props) {
            ret[bud.name] = parts[i++];
        }
        return ret;
    }
}

export class EntityBud extends EntityAtomIDWithBase {
    join: EntityAtomID;

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'join': this.join = val; break;
        }
    }
}

export class EntityPick extends Entity {
    atoms: EntityAtom[];
    uom: boolean;
    spec: EntitySpec;
    joins: (EntityAtomID | EntityOptions)[];
    protected override fromSwitch(i: string, val: any) {
        const { entities } = this.biz;
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'atoms': this.atoms = (val as string[]).map(v => entities[v] as any); break;
            case 'uom': this.uom = val; break;
            case 'spec': this.spec = entities[val] as EntitySpec; break;
            case 'joins': this.joins = (val as string[]).map(v => entities[v] as any); break;
        }
    }
}