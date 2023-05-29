import { BizProp } from "./BizBud";
import { Entity } from "./Entity";

export class EntitySpec extends Entity {
    readonly keys: Map<string, BizProp> = new Map();
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'keys': this.fromKeys(val); break;
        }
    }

    protected fromKeys(keys: any[]) {
        for (let key of keys) {
            let { name, type } = key;
            let bizProp = new BizProp(this.biz, name, type, this);
            let { budDataType: budType } = bizProp;
            if (budType === undefined) debugger;
            budType.fromSchema(key);
            this.keys.set(bizProp.phrase, bizProp);
        }
    }

    getValues(specValue: any): string {
        if (!specValue) return '';
        let ret: string[] = [];
        for (let [, value] of this.keys) {
            ret.push(specValue[value.name] ?? '');
        }
        for (let [, value] of this.props) {
            ret.push(specValue[value.name] ?? '');
        }
        let s = ret.join(String.fromCharCode(12));
        return s;
    }

    fromValues(values: string): any {
        let ret: { [key: string]: any } = {};
        let parts = values.split(String.fromCharCode(12));
        let i = 0;
        for (let [, value] of this.keys) {
            ret[value.name] = parts[i++];
        }
        for (let [, value] of this.props) {
            ret[value.name] = parts[i++];
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
        const verticals: EntityAtom[] = [];
        for (let p: EntityAtom = this; p !== undefined; p = p.base) {
            verticals.unshift(p);
        }
        let { props, assigns } = this;
        for (let p of verticals) {
            for (let [, bud] of p.selfProps) {
                let { name, phrase } = bud;
                props.set(name, bud);
                props.set(phrase, bud);
            }
            for (let [, bud] of p.selfAssigns) {
                let { name, phrase } = bud;
                assigns.set(name, bud);
                assigns.set(phrase, bud);
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
        let base = this.base = this.biz.entities[baseName] as EntityAtom;// this.biz.atoms[baseName];
        base.children.push(this);
    }

    protected fromSpec(spec: any) {
        //this.spec = this.biz.specs[spec];
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

