import { PendRow } from "../SheetStore";
import { NamedResults } from "../NamedResults";
import { BinStore } from "../BinEditing";

let rowId = 1;

export function getMockId() { return rowId++; }

export interface PendProps {
    // sheetStore: SheetStore;
    // bin: EntityBin;
    // entity: EntityPend;
    // ownerColl: OwnerColl;
    binStore: BinStore;
    namedResults: NamedResults;
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

