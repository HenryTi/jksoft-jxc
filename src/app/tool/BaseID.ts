import { UqApp } from "../UqApp";

export abstract class BaseID {
    readonly uqApp: UqApp;
    get uq() { return this.uqApp.uq; };

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
    }

    abstract getId(): Promise<string | number>;
}

export abstract class BaseIDPropUnit extends BaseID {
    protected base: number | string;
    protected id: number | string;
    abstract get prop(): string;
    get baseID(): BaseID { return this.uqApp.baseIDUnit; }

    async getId(): Promise<string | number> {
        let baseID = this.baseID;
        let base = await baseID.getId();
        if (base === this.base && this.id !== undefined) return this.id;
        let { uq } = this.uqApp;
        let propId = await uq.ActID({ ID: uq.Prop, value: { base, name: this.prop } });
        let propUnit = await uq.ActID({ ID: uq.Join, value: { base, item: propId } });
        this.id = propUnit;
        this.base = base;
        return this.id;
    }
}

export class BaseIDUnit extends BaseID {
    declare readonly unit: number;
    constructor(uqApp: UqApp, unit: number) {
        super(uqApp);
        this.unit = unit;
    }
    async getId(): Promise<string | number> {
        return this.unit;
    };
}
