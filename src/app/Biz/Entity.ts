import { BizProp, BizAssign } from "./BizBud";
import { BizBase } from "./BizBase";

export class Entity extends BizBase {
    get phrase() { return `${this.type}.${this.name}`; }
    readonly selfProps: BizProp[] = [];       // 本 Atom 定义的
    readonly propColl: { [key: string]: BizProp; } = {};           // 包括全部继承来的
    readonly props: BizProp[] = [];
    readonly assignColl: { [key: string]: BizAssign; } = {};
    readonly selfAssigns: BizAssign[] = [];
    readonly assigns: BizAssign[] = [];

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
            let { name, dataType } = prop;
            let bizBud = new BizProp(this.biz, name, dataType, this);
            let { budDataType } = bizBud;
            if (budDataType === undefined) debugger;
            budDataType.fromSchema(prop);
            bizBud.fromSchema(prop);
            this.selfProps.push(bizBud);
        }
    }

    protected fromAssigns(assigns: any[]) {
        for (let assign of assigns) {
            let { name, dataType } = assign;
            let bizBud = new BizAssign(this.biz, name, dataType, this);
            let { budDataType } = bizBud;
            if (budDataType === undefined) debugger;
            budDataType.fromSchema(assign);
            bizBud.fromSchema(assign);
            this.selfAssigns.push(bizBud);
        }
    }

    protected buildBuds() {
        for (let bud of this.selfProps) {
            let { name, phrase } = bud;
            this.propColl[name] = bud;
            this.propColl[phrase] = bud;
            this.props.push(bud);
        }
        for (let bud of this.selfAssigns) {
            let { name, phrase } = bud;
            this.assignColl[name] = bud;
            this.assignColl[phrase] = bud;
            this.assigns.push(bud);
        }
    }

    scan() {
        for (let bud of this.selfProps) {
            bud.scan();
        }
        for (let bud of this.selfAssigns) {
            bud.scan();
        }
        this.buildBuds();
    }
}
