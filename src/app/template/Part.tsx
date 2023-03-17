import { UqApp } from "app/UqApp";
import { NavigateFunction } from "react-router-dom";
import { UqID } from "tonwa-uq";
import { JsTicket } from "uqs";

export abstract class Part {
    readonly uqApp: UqApp;
    readonly uq: JsTicket.UqExt;

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uq = uqApp.uqs.JsTicket;
    }
    abstract get caption(): string;
}

export abstract class PartWithPath extends Part {
    abstract get path(): string;
    navigate: NavigateFunction;
}

export abstract class PartInput extends PartWithPath {
    get name(): string { return this.ID.name; }
    abstract get ID(): UqID<any>;
}

export interface PartProps<T extends Part> {
    Part: new (uqApp: UqApp) => T;
}
