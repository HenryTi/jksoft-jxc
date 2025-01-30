import { EntityID } from "tonwa";
import { BudValue } from "tonwa-app";

export interface AtomIDValue {
    id: number;
    main: any;
    buds: { [prop: number]: BudValue; };
    entityID: EntityID;
}
