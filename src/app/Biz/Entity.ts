import { BizProp, BizAssign, BizBud } from "./BizBud";
import { BizBase } from "./BizBase";

export class Entity extends BizBase {
    get phrase() { return this.name; }
    readonly selfProps: BizProp[] = [];       // 本 Atom 定义的
    readonly buds: { [key: string]: BizBud; } = {};           // 包括全部继承来的
    readonly props: BizProp[] = [];
    readonly selfAssigns: BizAssign[] = [];
    readonly assigns: BizAssign[] = [];

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'props': this.fromProps(val); break;
            case 'assigns': this.fromAssigns(val); break;
        }
    }

    protected fromProp(prop: any) {
        let { name, dataType } = prop;
        let bizBud = new BizProp(this.biz, name, dataType, this);
        let { budDataType } = bizBud;
        if (budDataType === undefined) debugger;
        budDataType.fromSchema(prop);
        bizBud.fromSchema(prop);
        return bizBud;
    }

    protected fromProps(props: any[]) {
        for (let prop of props) {
            let bizBud = this.fromProp(prop);
            this.selfProps.push(bizBud);
        }
    }

    protected fromAssigns(assigns: any[]) {
        if (assigns === undefined) {
            debugger;
            return;
        }
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
            this.buds[name] = bud;
            this.buds[phrase] = bud;
            this.props.push(bud);
        }
        for (let bud of this.selfAssigns) {
            let { name, phrase } = bud;
            this.buds[name] = bud;
            this.buds[phrase] = bud;
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
