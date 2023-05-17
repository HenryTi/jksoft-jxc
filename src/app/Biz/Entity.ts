import { BizProp, BizAssign } from "./BizBud";
import { BizBase } from "./BizBase";

export class Entity extends BizBase {
    get phrase() { return `${this.type}.${this.name}`; }
    readonly selfProps: Map<string, BizProp> = new Map();
    readonly selfAssigns: Map<string, BizAssign> = new Map();
    readonly props: Map<string, BizProp> = new Map();
    readonly assigns: Map<string, BizAssign> = new Map();

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'main': this.fromMain(val); break;
            case 'props': this.fromProps(val); break;
            case 'assigns': this.fromAssigns(val); break;
        }
    }

    protected fromMain(val: any) {
    }

    protected fromProps(props: any[]) {
        for (let prop of props) {
            let { name, type } = prop;
            let bizBud = new BizProp(this.biz, name, type, this);
            let { budType } = bizBud;
            if (budType === undefined) debugger;
            budType.fromSchema(prop);
            bizBud.fromSchema(prop);
            this.selfProps.set(bizBud.phrase, bizBud);
        }
    }

    protected fromAssigns(assigns: any[]) {
        for (let assign of assigns) {
            let { name, type } = assign;
            let bizBud = new BizAssign(this.biz, name, type, this);
            let { budType } = bizBud;
            if (budType === undefined) debugger;
            budType.fromSchema(assign);
            bizBud.fromSchema(assign);
            this.selfAssigns.set(bizBud.phrase, bizBud);
        }
    }

    protected buildBuds() {
        for (let [, bud] of this.selfProps) {
            this.props.set(bud.name, bud);
        }
        for (let [, bud] of this.selfAssigns) {
            this.assigns.set(bud.name, bud);
        }
    }

    scan() {
        for (let [, bud] of this.selfProps) {
            bud.scan();
        }
        for (let [, bud] of this.selfAssigns) {
            bud.scan();
        }
        this.buildBuds();
    }
}
