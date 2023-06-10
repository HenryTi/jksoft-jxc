import { BizProp } from "./BizBud";
import { Entity } from "./Entity";

export class EntitySpec extends Entity {
    readonly keyColl: { [key: string]: BizProp; } = {};
    readonly keys: BizProp[] = [];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'keys': this.fromKeys(val); break;
        }
    }

    protected fromKeys(keys: any[]) {
        for (let key of keys) {
            let { name, dataType } = key;
            let bizProp = new BizProp(this.biz, name, dataType, this);
            let { budDataType } = bizProp;
            if (budDataType === undefined) debugger;
            budDataType.fromSchema(key);
            this.keyColl[bizProp.phrase] = bizProp;
            this.keys.push(bizProp);
        }
    }

    getValues(specValue: any): string {
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

    fromValues(values: string): any {
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

export class EntityAtom extends Entity {
    base: EntityAtom;
    spec: EntitySpec;
    metric: string;
    readonly children: EntityAtom[] = [];

    protected override buildBuds() {
        const ancestors: EntityAtom[] = [];
        for (let p: EntityAtom = this; p !== undefined; p = p.base) {
            ancestors.unshift(p);
        }
        let { propColl, assignColl, props, assigns } = this;
        for (let p of ancestors) {
            for (let bud of p.selfProps) {
                let { name, phrase } = bud;
                propColl[name] = bud;
                propColl[phrase] = bud;
                props.push(bud);
            }
            for (let bud of p.selfAssigns) {
                let { name, phrase } = bud;
                assignColl[name] = bud;
                assignColl[phrase] = bud;
                assigns.push(bud);
            }
        }
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'states': this.fromStates(val); break;
            case 'base': this.fromBase(val); break;
            case 'spec': this.fromSpec(val); break;
            case 'metric': this.metric = val; break;
        }
    }

    protected fromStates(states: any[]) {
    }

    protected fromBase(baseName: any) {
        let base = this.base = this.biz.entities[baseName] as EntityAtom;
        base.children.push(this);
    }

    protected fromSpec(spec: any) {
        this.spec = this.biz.entities[spec] as EntitySpec;
    }

    scan() {
        super.scan();
        let spec: EntitySpec;
        for (let p: EntityAtom = this; p !== undefined; p = p.base) {
            spec = p.spec;
            if (spec !== undefined) break;
        }
        this.spec = spec;
    }
}

