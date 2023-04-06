import { Biz } from "./Biz";
import { BizBase } from "./BizBase";
import { Entity } from "./Entity";

export abstract class BizAtom extends BizBase {
    protected readonly entity: Entity;
    constructor(biz: Biz, name: string, type: string, entity: Entity) {
        super(biz, name, type);
        this.entity = entity;
    }

    get phrase(): string {
        return `${this.entity.phrase}.${this.name}`;
    }
}

export class BizProp extends BizAtom {
}

export class BizAssign extends BizAtom {
}
