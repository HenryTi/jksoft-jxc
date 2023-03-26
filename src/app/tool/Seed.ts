import { Entity } from "tonwa-uq";
import { UqExt } from "uqs/UqDefault";
import { UqApp } from "../UqApp";

type SeedId = number | string;

export abstract class Seed {
    protected readonly uq: UqExt;
    protected readonly uqApp: UqApp;
    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
    }
    abstract getId(): Promise<SeedId>;
}

export abstract class SeedJoin extends Seed {
    protected abstract get baseSeed(): SeedJoin;
    private id: SeedId;
    protected baseId: SeedId;

    protected abstract getItemId(): Promise<SeedId>;

    protected async getJoinId(itemId: SeedId): Promise<SeedId> {
        let { uq } = this.uqApp;
        let joinId = await uq.ActID({ ID: uq.Bind, value: { base: this.baseId, item: itemId } });
        return joinId;
    }

    async getId(): Promise<SeedId> {
        let baseSeed = this.baseSeed;
        let baseId = baseSeed === undefined ? 0 : await baseSeed.getId();
        if (baseId === this.baseId && this.id !== undefined) return this.id;
        this.baseId = baseId;
        let itemId = await this.getItemId();
        let joinId = await this.getJoinId(itemId);
        return this.id = joinId;
    }
}

abstract class SeedProp extends SeedJoin {
    protected abstract get prop(): string;
    protected async getItemId(): Promise<SeedId> {
        let { uq } = this.uqApp;
        let propId = await uq.ActID({ ID: uq.Prop, value: { base: this.baseId, name: this.prop } });
        return propId;
    }
}

abstract class SeedRootProp extends SeedProp {
    protected get baseSeed(): SeedJoin { return undefined; }
}
class SeetRootItem extends SeedRootProp {
    protected get prop() { return this.uq.Item.name; }
}

export abstract class SeedItem extends SeedProp {
    protected get baseSeed(): SeedJoin { return this.uqApp.objectOf(SeetRootItem); }
    protected get prop() { return this.item; }
    protected abstract get item(): string;
}

class SeetRootSheet extends SeedRootProp {
    protected get prop() { return this.uq.Sheet.name; }
}
export abstract class SeedSheet extends SeedRootProp {
    protected get baseSeed(): SeedJoin { return this.uqApp.objectOf(SeetRootSheet); }
    protected get prop() { return this.sheet; }
    abstract get sheet(): string;
}

class SeetRootAtom extends SeedRootProp {
    protected get prop() { return this.uq.Bind.name; }
}
export abstract class SeedAtom extends SeedRootProp {
    protected get baseSeed(): SeedJoin { return this.uqApp.objectOf(SeetRootAtom); }
    protected get prop() { return this.atom; }
    abstract get atom(): string;
}

class SeedUser extends SeedRootProp {
    protected get prop() { return '$user'; }
}
class SeedUseId extends SeedJoin {
    protected get baseSeed() { return this.uqApp.objectOf(SeedUser) }
    protected override async getItemId(): Promise<SeedId> {
        return undefined;
    }
}

class SeedUnit extends SeedRootProp {
    protected get prop() { return '$unit'; }
}
class SeedUnitId extends SeedJoin {
    readonly unit: number = 99;
    protected get baseSeed() { return this.uqApp.objectOf(SeedUnit) }
    protected override async getItemId(): Promise<SeedId> {
        return this.unit;
    }
}

abstract class SeedRoot extends SeedJoin {
    protected get baseSeed(): SeedJoin { return undefined; }
    protected get rootEntity(): Entity { return undefined; };
    protected get root(): string { return this.rootEntity.name; }
    protected async getItemId(): Promise<SeedId> {
        let { uq } = this.uqApp;
        let propId = await uq.ActID({ ID: uq.Prop, value: { base: this.baseId, name: this.root } });
        return propId;
    }
}
class SeedUnitRootProp extends SeedRoot {
    protected get baseSeed() { return this.uqApp.objectOf(SeedUnitId); }
}
export abstract class SeedFlow extends SeedJoin {
    protected abstract get flow(): string;
}
/*
export class SeedFlowStart extends SeedFlow {
    protected override get baseSeed() { return this.uqApp.objectOf(SeedRootSheet); }
    protected get flow() { return FlowType.start; }
}

export class SeedStart extends SeedJoin {
    protected override get baseSeed() { return this.uqApp.objectOf(SeedFlowStart); }
    protected override async getItemId(): Promise<SeedId> {
        return undefined; // means user
    }
}
*/