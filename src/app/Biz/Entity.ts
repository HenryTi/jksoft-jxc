import { BizBud } from "./BizBud";
import { BizBase } from "./BizBase";

export class Entity extends BizBase {
    readonly selfProps: BizBud[] = [];       // 本 Atom 定义的
    readonly buds: { [key: string | number]: BizBud; } = {};           // 包括全部继承来的
    readonly props: BizBud[] = [];

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'props': this.fromProps(val); break;
            case 'groups': this.fromGroups(val); break;
        }
    }

    protected fromGroups(groups: any) {
    }

    protected fromProp(prop: any) {
        let { id, name, dataType } = prop;
        let bizBud = new BizBud(this.biz, id, name, dataType, this);
        let { budDataType } = bizBud;
        if (budDataType === undefined) {
            debugger;
            return;
        }
        budDataType.fromSchema(prop);
        bizBud.fromSchema(prop);
        return bizBud;
    }

    protected fromProps(props: any[]) {
        for (let prop of props) {
            let bizBud = this.fromProp(prop);
            if (bizBud === undefined) continue;
            this.selfProps.push(bizBud);
        }
    }

    protected buildBuds() {
        for (let bud of this.selfProps) {
            let { id, name, phrase } = bud;
            this.buds[id] = bud;
            this.buds[name] = bud;
            this.buds[phrase] = bud;
            this.props.push(bud);
        }
    }
    /*
    protected fromPickable(prop: any): Pickable {
        return prop;
    }
    */

    scan() {
        for (let bud of this.selfProps) {
            bud.scan();
        }
        this.buildBuds();
    }
}
