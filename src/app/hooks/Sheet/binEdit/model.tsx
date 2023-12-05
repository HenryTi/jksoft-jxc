import { EntityBin, EntityPend } from "app/Biz";
import { BudValue } from "tonwa-app";
import { SheetStore } from "../SheetStore";
import { PendRow } from "../SheetStore";
import { NamedResults } from "../NamedResults";
import { BinStore } from "../BinEditing";

interface OwnerColl {
    [row: number]: {
        [owner: number]: [number, BudValue][];
    };
}

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

