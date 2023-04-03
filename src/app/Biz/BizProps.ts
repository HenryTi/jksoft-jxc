import { BizBase } from "./BizBase";
import { BizProp, BizSetting } from "./BizProp";

export class BizProps extends BizBase {
    readonly props: Map<string, BizProp> = new Map();
    readonly settings: Map<string, BizSetting> = new Map();

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'props': this.fromProps(val); break;
            case 'settings': this.fromSettings(val); break;
        }
    }

    protected fromProps(props: any[]) {
        for (let prop of props) {
            let { name, type } = prop;
            let bizProp = new BizProp(this.biz, name, type);
            this.props.set(name, bizProp);
        }
    }

    protected fromSettings(settings: any[]) {
        for (let setting of settings) {
            let { name, type } = setting;
            let bizSetting = new BizSetting(this.biz, name, type);
            this.settings.set(name, bizSetting);
        }
    }
}

