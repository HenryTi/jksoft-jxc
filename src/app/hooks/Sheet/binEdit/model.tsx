import { PendRow } from "../store";
import { NamedResults } from "../NamedResults";
import { DivStore } from "../store";

let rowId = 1;

export function getMockId() { return rowId++; }

export interface PendProps {
    // sheetStore: SheetStore;
    // bin: EntityBin;
    // entity: EntityPend;
    // ownerColl: OwnerColl;
    divStore: DivStore;
    // namedResults: NamedResults;
}

export interface PagePendProps extends PendProps {
    caption: string;
    search: string[];
    // pendRows: PendRow[];
}

export interface PendBandProps extends PendProps {
    value: PendRow;
    hasPrice: boolean;
    hasAmount: boolean;
}

