import { NavigateFunction } from "react-router-dom";
import { UqID } from "tonwa-uq";
import { UqApp } from "../UqApp";
import { BaseID, Part } from "../tool";

export abstract class PartWithPath extends Part {
    abstract get path(): string;
    navigate: NavigateFunction;
}

export abstract class PartInput extends PartWithPath {
    get name(): string { return this.ID.name; }
    abstract get ID(): UqID<any>;
    abstract get baseID(): BaseID;
}

export interface PartProps<T extends Part> {
    Part: new (uqApp: UqApp) => T;
}
