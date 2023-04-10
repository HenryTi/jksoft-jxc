import { UqApp, useUqApp } from "../UqApp";
import { Biz } from "../Biz";

export abstract class Gen {
    readonly uqApp: UqApp;
    readonly biz: Biz;
    get uq() { return this.uqApp.uq; };

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.biz = uqApp.objectOf(Biz);
    }
}

export function useGen<P>(Gen: new (uqApp: UqApp) => P) {
    let uqApp = useUqApp();
    return uqApp.objectOf(Gen);
}

export interface GenProps<T extends Gen> {
    Gen: new (uqApp: UqApp) => T;
}

export abstract class GenBizEntity extends Gen {
    abstract get bizEntityType(): string;
    abstract get bizEntityName(): string;
    abstract get caption(): string;
}