import { NavigateFunction } from "react-router-dom";
import { UqID } from "tonwa-uq";
import { UqApp } from "../UqApp";
import { SeedJoin, Part } from "../tool";

export abstract class PartWithPath extends Part {
    abstract get path(): string;
    navigate: NavigateFunction;
}

export abstract class PartInput extends PartWithPath {
    abstract get ID(): UqID<any>;
}

export interface PartProps<T extends Part> {
    Part: new (uqApp: UqApp) => T;
}
