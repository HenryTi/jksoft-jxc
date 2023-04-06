import { BizProp, BizAssign } from "./BizAtom";
import { BizBase } from "./BizBase";

export class Entity extends BizBase {
    get phrase() { return `${this.type}.${this.name}`; }

    readonly props: Map<string, BizProp> = new Map();
    readonly assigns: Map<string, BizAssign> = new Map();

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'props': this.fromProps(val); break;
            case 'assigns': this.fromAssigns(val); break;
        }
    }

    protected fromProps(props: any[]) {
        for (let prop of props) {
            let { name, type } = prop;
            let bizProp = new BizProp(this.biz, name, type, this);
            this.props.set(bizProp.phrase, bizProp);
        }
    }

    protected fromAssigns(assigns: any[]) {
        for (let assign of assigns) {
            let { name, type } = assign;
            let bizAssign = new BizAssign(this.biz, name, type, this);
            this.assigns.set(bizAssign.phrase, bizAssign);
        }
    }
}
