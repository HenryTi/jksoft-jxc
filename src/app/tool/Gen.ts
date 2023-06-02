import { UqApp, useUqApp } from "../UqApp";
import { Biz, Entity } from "../Biz";

export abstract class Gen {
    readonly uqApp: UqApp;
    readonly biz: Biz;
    get uq() { return this.uqApp.uq; };

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.biz = uqApp.objectOf(Biz);
    }
}

export function useGen<P extends Gen>(Gen: new (uqApp: UqApp) => P) {
    let uqApp = useUqApp();
    return uqApp.objectOf(Gen);
}

export interface GenProps<T extends Gen> {
    Gen: new (uqApp: UqApp) => T;
}

export abstract class GenBizEntity<E extends Entity> extends Gen {
    abstract get bizEntityType(): string;
    abstract get bizEntityName(): string;
    get entity(): E {
        let ret = this.biz.entities[this.bizEntityName] as E;
        if (ret === undefined) {
            throw new Error(`${this.bizEntityName} is not a valid BIZ ENTITY`);
        }
        return ret;
    }
    get caption() {
        let { name, caption } = this.entity;
        return caption ?? name;
    }
    get phrase() {
        let { name, type } = this.entity;
        return `${type}.${name}`;
    }
}
