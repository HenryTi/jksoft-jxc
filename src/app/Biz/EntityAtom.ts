import { BizBud } from "./BizBud";
import { Entity } from "./Entity";

export abstract class EntityAtomID extends Entity {
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
                let { id, name, phrase } = bud;
                buds[name] = bud;
                buds[phrase] = bud;
                buds[id] = bud;
                props.push(bud);
            }
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
    ix: boolean;

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
            this.keyColl[bizProp.phrase] = bizProp;
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
