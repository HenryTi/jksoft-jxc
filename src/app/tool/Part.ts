import { UqApp, useUqApp } from "../UqApp";

export abstract class Part {
    readonly uqApp: UqApp;
    get uq() { return this.uqApp.uq; };

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
    }
    abstract get caption(): string;
}

export function usePart<P>(Part: new (uqApp: UqApp) => P) {
    let uqApp = useUqApp();
    return uqApp.objectOf(Part);
}
