import { NavigateFunction } from "react-router-dom";
import { UqID } from "tonwa-uq";
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
    abstract get caption(): string;
}

export function useGen<P>(Gen: new (uqApp: UqApp) => P) {
    let uqApp = useUqApp();
    return uqApp.objectOf(Gen);
}

export interface GenProps<T extends Gen> {
    Gen: new (uqApp: UqApp) => T;
}

export abstract class GentWithPath extends Gen {
    abstract get path(): string;
    navigate: NavigateFunction;
}

export abstract class GenInput extends GentWithPath {
    abstract get Atom(): UqID<any>;
}
